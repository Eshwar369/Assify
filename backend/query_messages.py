"""
==============================================================================
ASSIFY — Production Message Query & Visual Inspector
Features:
- Auto-saves all results cleanly to files (clean .txt + interactive .html viewer).
- Zero console clutter: clean summary + preview, with clickable file links.
- Interactive HTML Chat Viewer: WhatsApp/Delulu style dark mode bubbles,
  live instant search box, and sender filter tabs (100% offline, self-contained).
- Flexible input: accepts dates (e.g., '19-10-2026', '19') or search words ('yum').

Usage Examples:
    # 1. Query a date (outputs to output/chat_2026-10-19.txt & .html)
    python query_messages.py 19-10-2026 --day-only
    python query_messages.py 17-8-2026

    # 2. Search a word across ALL time
    python query_messages.py "yum"
    python query_messages.py "pulihora"

    # 3. Automatically open interactive HTML viewer in browser
    python query_messages.py 19-10-2026 -1 --open
==============================================================================
"""

import os
import sys
import re
import html
import sqlite3
import argparse
import webbrowser
from datetime import datetime, timedelta
from pathlib import Path

# Fix Windows console UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DB_PATH = ROOT_DIR / "backend" / "assify.db"
OUTPUT_DIR = ROOT_DIR / "output"

# ANSI color codes for terminal
ANSI_BOLD = "\033[1m"
ANSI_CYAN = "\033[36m"
ANSI_GREEN = "\033[32m"
ANSI_YELLOW = "\033[93m"
ANSI_RESET = "\033[0m"


def try_parse_date(val: str) -> str:
    """
    Parses flexible human date strings and converts to ISO 'YYYY-MM-DD':
    - '19-10-2026' or '17-8-2026' -> 'YYYY-MM-DD'
    - '19' or '19th' -> '2026-10-19'
    """
    if not val:
        return None
    val = val.strip().lower()

    # Day shortcuts
    if val in ("19", "19th", "oct 19", "oct-19"):
        return "2026-10-19"
    if val in ("18", "18th", "oct 18", "oct-18"):
        return "2026-10-18"
    if val in ("17", "17th", "oct 17", "oct-17"):
        return "2026-10-17"

    # DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    m_dmy = re.match(r"^(\d{1,2})[-/\.](\d{1,2})[-/\.](\d{4})$", val)
    if m_dmy:
        d, m, y = int(m_dmy.group(1)), int(m_dmy.group(2)), int(m_dmy.group(3))
        try:
            return datetime(y, m, d).strftime("%Y-%m-%d")
        except ValueError:
            return None

    # YYYY-MM-DD or YYYY/MM/DD
    m_ymd = re.match(r"^(\d{4})[-/\.](\d{1,2})[-/\.](\d{1,2})$", val)
    if m_ymd:
        y, m, d = int(m_ymd.group(1)), int(m_ymd.group(2)), int(m_ymd.group(3))
        try:
            return datetime(y, m, d).strftime("%Y-%m-%d")
        except ValueError:
            return None

    return None


def clean_text_for_display(text: str) -> str:
    """Normalizes newlines, tabs, and unprintable characters."""
    if not text:
        return ""
    cleaned = text.replace("\r\n", " ").replace("\r", " ").replace("\n", " ")
    cleaned = re.sub(r"[\x00-\x1f\x7f-\x9f]", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def query_messages(
    db_path: Path = DEFAULT_DB_PATH,
    start_date: str = None,
    end_date: str = None,
    search: str = None,
    sender: str = None,
    limit: int = None,
):
    """Queries SQLite database for messages with given filters."""
    if not db_path.exists():
        print(f"[ERROR] Database file not found at: {db_path}")
        return []

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    query = """
        SELECT 
            m.id,
            m.time_stamp,
            m.sender,
            m.raw_sender,
            m.content,
            m.media_type,
            c.display_name,
            c.user_name
        FROM messages m
        LEFT JOIN contacts c ON m.contact_id = c.id
        WHERE 1=1
    """
    params = []

    if start_date:
        query += " AND m.time_stamp >= ?"
        params.append(start_date)

    if end_date:
        query += " AND m.time_stamp < ?"
        params.append(end_date)

    if sender:
        query += " AND m.sender = ?"
        params.append(sender)

    if search:
        query += " AND m.content LIKE ?"
        params.append(f"%{search}%")

    query += " ORDER BY m.time_stamp ASC"

    if limit:
        query += f" LIMIT {int(limit)}"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return rows


# ==============================================================================
# HTML CHAT VIEWER GENERATOR (Self-Contained Dark Mode Delulu UI)
# ==============================================================================
def generate_html_viewer(
    rows,
    title: str,
    subtitle: str,
    user_name: str,
    contact_name: str,
    search_term: str = None,
) -> str:
    """
    Builds a standalone, responsive HTML file resembling a modern messaging app.
    Features instant client-side search, sender filtering tabs, and message stats.
    """
    total = len(rows)
    user_cnt = sum(1 for r in rows if r["sender"] == "user")
    contact_cnt = sum(1 for r in rows if r["sender"] == "contact")

    # Render message bubbles
    bubbles_html = []
    current_date_str = ""

    for r in rows:
        ts = r["time_stamp"]
        date_part = ts[:10]
        time_part = ts[11:16]
        sender = r["sender"]
        is_user = (sender == "user")
        sender_label = user_name if is_user else contact_name
        raw_msg = r["content"] or ""
        escaped_msg = html.escape(raw_msg).replace("\n", "<br>")

        # Highlight search keyword in HTML if provided
        if search_term:
            pattern = re.compile(re.escape(html.escape(search_term)), re.IGNORECASE)
            escaped_msg = pattern.sub(lambda m: f"<mark class='highlight'>{m.group(0)}</mark>", escaped_msg)

        # Date separator
        if date_part != current_date_str:
            current_date_str = date_part
            bubbles_html.append(f"""
                <div class="date-divider">
                    <span>{current_date_str}</span>
                </div>
            """)

        bubble_class = "bubble-user" if is_user else "bubble-contact"
        align_class = "msg-user" if is_user else "msg-contact"
        badge_class = "badge-user" if is_user else "badge-contact"

        bubbles_html.append(f"""
            <div class="msg-row {align_class}" data-sender="{sender}" data-text="{html.escape(raw_msg.lower())}">
                <div class="bubble {bubble_class}">
                    <div class="bubble-header">
                        <span class="sender-name {badge_class}">{html.escape(sender_label)}</span>
                        <span class="msg-time">{time_part}</span>
                    </div>
                    <div class="bubble-text">{escaped_msg}</div>
                </div>
            </div>
        """)

    bubbles_joined = "\n".join(bubbles_html)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Assify Inspector — {html.escape(title)}</title>
<style>
  :root {{
    --bg-dark: #0a0e17;
    --card-bg: #111827;
    --border: #1f293d;
    --user-bubble: #1e3a8a;
    --user-border: #3b82f6;
    --contact-bubble: #1f2430;
    --contact-border: #374151;
    --text-primary: #f3f4f6;
    --text-muted: #9ca3af;
    --accent: #ec4899;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }}
  header {{
    background-color: var(--card-bg);
    border-bottom: 1px solid var(--border);
    padding: 14px 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    z-index: 10;
  }}
  .header-left h1 {{
    font-size: 1.15rem;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .header-left p {{
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 2px;
  }}
  .controls {{
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }}
  .search-box {{
    background-color: var(--bg-dark);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    width: 240px;
    outline: none;
    transition: border-color 0.2s;
  }}
  .search-box:focus {{
    border-color: var(--accent);
  }}
  .filter-btn {{
    background-color: var(--bg-dark);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.2s;
  }}
  .filter-btn:hover, .filter-btn.active {{
    background-color: #1f2937;
    color: #ffffff;
    border-color: #4b5563;
  }}
  .filter-btn.active {{
    border-color: var(--accent);
    color: var(--accent);
    font-weight: 600;
  }}
  #chat-container {{
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px 60px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scroll-behavior: smooth;
  }}
  .date-divider {{
    text-align: center;
    margin: 18px 0 10px 0;
  }}
  .date-divider span {{
    background-color: #1f2937;
    color: var(--text-muted);
    font-size: 0.72rem;
    padding: 4px 12px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }}
  .msg-row {{
    display: flex;
    width: 100%;
    margin-bottom: 2px;
  }}
  .msg-user {{
    justify-content: flex-end;
  }}
  .msg-contact {{
    justify-content: flex-start;
  }}
  .bubble {{
    max-width: 72%;
    min-width: 160px;
    padding: 8px 14px;
    border-radius: 14px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }}
  .bubble-user {{
    background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
    border-top-right-radius: 2px;
    color: #ffffff;
  }}
  .bubble-contact {{
    background: #1e2430;
    border: 1px solid #2d3748;
    border-top-left-radius: 2px;
    color: #e2e8f0;
  }}
  .bubble-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    gap: 12px;
  }}
  .sender-name {{
    font-size: 0.72rem;
    font-weight: 700;
  }}
  .badge-user {{ color: #93c5fd; }}
  .badge-contact {{ color: #f472b6; }}
  .msg-time {{
    font-size: 0.68rem;
    color: rgba(255,255,255,0.55);
  }}
  .bubble-text {{
    font-size: 0.88rem;
    line-height: 1.42;
    word-break: break-word;
  }}
  mark.highlight {{
    background-color: #facc15;
    color: #000;
    padding: 1px 3px;
    border-radius: 3px;
    font-weight: bold;
  }}
</style>
</head>
<body>
  <header>
    <div class="header-left">
      <h1>💬 Assify Inspector — {html.escape(title)}</h1>
      <p>{html.escape(subtitle)} | <strong>{total:,}</strong> messages ({user_name}: {user_cnt:,} | {contact_name}: {contact_cnt:,})</p>
    </div>
    <div class="controls">
      <input type="text" id="live-filter" class="search-box" placeholder="Instant filter messages..." oninput="filterMessages()">
      <button class="filter-btn active" onclick="setSenderFilter('all', this)">All ({total:,})</button>
      <button class="filter-btn" onclick="setSenderFilter('user', this)">{html.escape(user_name)} ({user_cnt:,})</button>
      <button class="filter-btn" onclick="setSenderFilter('contact', this)">{html.escape(contact_name)} ({contact_cnt:,})</button>
    </div>
  </header>

  <div id="chat-container">
    {bubbles_joined}
  </div>

  <script>
    let currentSender = 'all';

    function setSenderFilter(sender, btn) {{
      currentSender = sender;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMessages();
    }}

    function filterMessages() {{
      const query = document.getElementById('live-filter').value.toLowerCase().trim();
      const rows = document.querySelectorAll('.msg-row');
      
      rows.forEach(r => {{
        const sender = r.getAttribute('data-sender');
        const text = r.getAttribute('data-text');
        
        const matchesSender = (currentSender === 'all' || sender === currentSender);
        const matchesText = (!query || text.includes(query));
        
        if (matchesSender && matchesText) {{
          r.style.display = 'flex';
        }} else {{
          r.style.display = 'none';
        }}
      }});
    }}
  </script>
</body>
</html>
"""


def main():
    parser = argparse.ArgumentParser(
        description="Query messages from Assify DB and output results to clean files."
    )
    parser.add_argument(
        "query",
        nargs="?",
        default=None,
        help="Date to read (e.g. '19-10-2026', '19') OR search word (e.g. 'yum')",
    )
    parser.add_argument(
        "-s", "--search",
        type=str,
        default=None,
        help="Word to search",
    )
    parser.add_argument(
        "-d", "--date",
        type=str,
        default=None,
        help="Start date (YYYY-MM-DD or DD-MM-YYYY)",
    )
    parser.add_argument(
        "--to", "--end-date",
        dest="end_date",
        type=str,
        default=None,
        help="End date filter (exclusive)",
    )
    parser.add_argument(
        "-1", "--day-only",
        action="store_true",
        help="Only messages for that single 24-hour day (00:00 to 23:59)",
    )
    parser.add_argument(
        "--sender",
        type=str,
        default=None,
        choices=["user", "contact"],
        help="Filter by sender ('user' or 'contact')",
    )
    parser.add_argument(
        "-n", "--limit",
        type=int,
        default=None,
        help="Limit number of rows",
    )
    parser.add_argument(
        "-o", "--open",
        action="store_true",
        help="Automatically open the generated HTML chat viewer in default browser",
    )
    parser.add_argument(
        "-p", "--print",
        dest="stdout_print",
        action="store_true",
        help="Print all message lines directly to terminal (disabled by default to prevent clutter)",
    )
    args = parser.parse_args()

    # Determine whether positional input is a date or search term
    pos_date = try_parse_date(args.query)
    explicit_date = try_parse_date(args.date)

    if pos_date:
        start_date = pos_date
        search_term = args.search
    else:
        start_date = explicit_date
        search_term = args.search or args.query

    end_date = try_parse_date(args.end_date)

    # Handle --day-only constraint
    if args.day_only and start_date and not end_date:
        dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = (dt + timedelta(days=1)).strftime("%Y-%m-%d")

    # Fetch rows
    rows = query_messages(
        db_path=DEFAULT_DB_PATH,
        start_date=start_date,
        end_date=end_date,
        search=search_term,
        sender=args.sender,
        limit=args.limit,
    )

    total = len(rows)

    # Build description and file slugs
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if start_date and end_date and args.day_only:
        time_desc = f"Single Day: {start_date}"
        file_slug = f"chat_{start_date}"
    elif start_date and end_date:
        time_desc = f"From {start_date} to {end_date}"
        file_slug = f"chat_{start_date}_to_{end_date}"
    elif start_date:
        time_desc = f"From {start_date} onwards"
        file_slug = f"chat_{start_date}_onwards"
    else:
        time_desc = "All Time (Full History)"
        file_slug = "chat_all_time"

    if search_term:
        safe_search = re.sub(r"[^\w\-]", "_", search_term)
        file_slug += f"_search_{safe_search}"

    txt_path = OUTPUT_DIR / f"{file_slug}.txt"
    html_path = OUTPUT_DIR / f"{file_slug}.html"

    # Terminal summary banner
    print("\n" + "═" * 72)
    print(f" {ANSI_BOLD}ASSIFY MESSAGE QUERY & VISUAL INSPECTOR{ANSI_RESET}")
    print(f" • Time Window : {time_desc}")
    if search_term:
        print(f" • Search Term : '{search_term}'")
    if args.sender:
        print(f" • Sender      : {args.sender.upper()} only")
    print(f" • Total Found : {ANSI_BOLD}{total:,}{ANSI_RESET} messages")
    print("═" * 72)

    if total == 0:
        print("[!] No messages found matching criteria.")
        print("═" * 72 + "\n")
        return

    user_count = sum(1 for r in rows if r["sender"] == "user")
    contact_count = sum(1 for r in rows if r["sender"] == "contact")
    display_name = rows[0]["display_name"] or "Contact"
    user_name = rows[0]["user_name"] or "User"

    print(f" • {user_name} (User)    : {user_count:,} messages ({user_count/total*100:.1f}%)")
    print(f" • {display_name} (Contact) : {contact_count:,} messages ({contact_count/total*100:.1f}%)")
    print(f" • Timestamp Range     : {rows[0]['time_stamp']} -> {rows[-1]['time_stamp']}")
    print("─" * 72)

    # 1. Write clean text file
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(f"=== ASSIFY CHAT LOG: {time_desc} ===\n")
        f.write(f"Total: {total:,} messages | {user_name}: {user_count:,} | {display_name}: {contact_count:,}\n\n")
        for r in rows:
            ts = r["time_stamp"].replace("T", " ")[:19]
            sender_label = user_name if r["sender"] == "user" else display_name
            role = r["sender"].upper()
            msg = clean_text_for_display(r["content"])
            f.write(f"[{ts}] {sender_label} ({role}): {msg}\n")

    # 2. Write HTML viewer
    html_content = generate_html_viewer(
        rows=rows,
        title=f"{time_desc}",
        subtitle=f"{display_name} & {user_name}",
        user_name=user_name,
        contact_name=display_name,
        search_term=search_term,
    )
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # 3. Print 6-message sample preview in terminal
    print(" 📜 Preview Sample (First 3 & Last 3):")
    sample_rows = rows[:3] + (rows[-3:] if total > 6 else rows[3:])
    for idx, r in enumerate(sample_rows):
        if idx == 3 and total > 6:
            print(f"   ... [{total - 6:,} messages omitted for clean terminal] ...")
        ts = r["time_stamp"][11:16]
        sender_label = user_name if r["sender"] == "user" else display_name
        role_col = ANSI_CYAN if r["sender"] == "user" else ANSI_GREEN
        snippet = clean_text_for_display(r["content"])
        if len(snippet) > 80:
            snippet = snippet[:80] + "..."
        print(f"   [{ts}] {role_col}{sender_label}{ANSI_RESET}: {snippet}")

    print("─" * 72)
    print(f" {ANSI_BOLD}📂 RESULTS SAVED TO FILES:{ANSI_RESET}")
    print(f"  📄 Text File : {txt_path}")
    print(f"  🌐 Web View  : {html_path}")
    print("═" * 72 + "\n")

    # 4. Optional --print to dump raw to terminal
    if args.stdout_print:
        for r in rows:
            ts = r["time_stamp"].replace("T", " ")[:19]
            role = r["sender"].upper()
            sender_label = user_name if r["sender"] == "user" else display_name
            print(f"[{ts}] {sender_label} ({role}): {clean_text_for_display(r['content'])}")

    # 5. Open in browser if requested
    if args.open:
        webbrowser.open(html_path.as_uri())


if __name__ == "__main__":
    main()
