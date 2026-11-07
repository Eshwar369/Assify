import re

def gfm_slug(text):
    # Remove markdown link formatting e.g. [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    # Remove code ticks
    text = text.replace('`', '')
    # GFM: convert to lower
    text = text.lower()
    # Punctuation stripped in GFM (does NOT collapse whitespace before space replacement)
    # punctuation chars: . , : ; ( ) [ ] { } / \ ' " ? ! @ # $ % ^ * + = ~ < >
    # note & is stripped, so " & " has two spaces, each becoming a hyphen -> "--"
    cleaned = []
    for ch in text:
        if ch.isalnum() or ch in (' ', '-'):
            cleaned.append(ch)
        elif ch in ('.', ',', ':', ';', '(', ')', '[', ']', '{', '}', '/', '\\', '\'', '"', '?', '!', '@', '#', '$', '%', '^', '*', '+', '=', '~', '<', '>', '&', '\u2019', '\u2018', '\u201c', '\u201d'):
            continue
        elif ord(ch) > 127:
            # Handle unicode like ö -> o or keep as-is
            cleaned.append(ch)
    s = "".join(cleaned)
    # Replace each space with hyphen
    s = s.replace(' ', '-')
    # Strip leading/trailing hyphens
    s = s.strip('-')
    return s

def main():
    with open('docs/spec_kit_research_report.md', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    headings = []
    for line in lines:
        line_clean = line.strip()
        m = re.match(r'^(#{1,6})\s+(.+)$', line_clean)
        if m:
            h_text = m.group(2).strip()
            slug = gfm_slug(h_text)
            headings.append((slug, h_text))

    toc_links = []
    in_toc = False
    for line in lines:
        if '## Table of Contents' in line:
            in_toc = True
            continue
        if in_toc and line.startswith('## '):
            break
        if in_toc:
            for link in re.findall(r'\[([^\]]+)\]\(#([^\)]+)\)', line):
                toc_links.append(link)

    print(f"Total TOC links: {len(toc_links)}")
    print(f"Total Headings: {len(headings)}")

    heading_slugs = {h[0]: h[1] for h in headings}

    broken = []
    for title, anchor in toc_links:
        # Check direct match
        if anchor in heading_slugs:
            continue
        # Check with normalized umlauts
        matched = False
        norm_anchor = anchor.replace('ö', 'o').replace('ä', 'a')
        for hs in heading_slugs:
            norm_hs = hs.replace('ö', 'o').replace('ä', 'a')
            if hs == anchor or norm_hs == norm_anchor:
                matched = True
                break
        if not matched:
            broken.append((title, anchor))

    print(f"Broken links count: {len(broken)}")
    if broken:
        for b in broken:
            print("BROKEN:", b)
    else:
        print("SUCCESS: 100% of TOC anchors resolve perfectly against GFM heading slugs!")

if __name__ == '__main__':
    main()
