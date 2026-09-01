import os
import re

def fix_suspense_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change PageContent signature
    content = re.sub(r'function PageContent\(\{ params \}: \{ params: Promise<\{ id: string \}> \}\)', 'function PageContent({ id }: { id: string })', content)
    content = re.sub(r'function PageContent\(\{ params \}: \{ params: \{ id: string \} \}\)', 'function PageContent({ id }: { id: string })', content)
    
    # Remove const { id } = use(params); from inside PageContent
    content = content.replace("const { id } = use(params);\n", "")

    # Replace the export default function Page at the bottom
    old_page_match = re.search(r'export default function Page\(.*?\).*?\{.*?\n.*?\}', content, re.DOTALL)
    if old_page_match:
        new_page = """export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent id={id} />
    </Suspense>
  );
}"""
        content = content.replace(old_page_match.group(0), new_page)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_suspense_page("frontend/src/app/risk/[id]/page.tsx")
fix_suspense_page("frontend/src/app/approvals/[id]/page.tsx")
print("Fixed suspense pages")
