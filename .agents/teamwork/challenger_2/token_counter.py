import os
import glob

def main():
    skill_files = glob.glob('.agents/skills/speckit-*/SKILL.md')
    print("=== Speckit Skills Analysis ===")
    total_chars = 0
    total_words = 0
    for f in sorted(skill_files):
        with open(f, 'r', encoding='utf-8') as fp:
            text = fp.read()
        chars = len(text)
        words = len(text.split())
        total_chars += chars
        total_words += words
        skill_name = os.path.basename(os.path.dirname(f))
        print(f"{skill_name:25} | Chars: {chars:6} | Words: {words:5} | Est Tokens (~chars/4): {chars//4:5}")
    
    print("-" * 65)
    print(f"{'Total All Skills':25} | Chars: {total_chars:6} | Words: {total_words:5} | Est Tokens: {total_chars//4:5}")
    print(f"Est Tokens (~words*1.33): {int(total_words * 1.33)}")

    templates = glob.glob('.specify/templates/*.md')
    print("\n=== Templates Analysis ===")
    t_chars = 0
    t_words = 0
    for f in sorted(templates):
        with open(f, 'r', encoding='utf-8') as fp:
            text = fp.read()
        chars = len(text)
        words = len(text.split())
        t_chars += chars
        t_words += words
        name = os.path.basename(f)
        print(f"{name:25} | Chars: {chars:6} | Words: {words:5} | Est Tokens (~chars/4): {chars//4:5}")
    print("-" * 65)
    print(f"{'Total Templates':25} | Chars: {t_chars:6} | Words: {t_words:5} | Est Tokens: {t_chars//4:5}")
    print(f"Est Tokens (~words*1.33): {int(t_words * 1.33)}")

if __name__ == "__main__":
    main()
