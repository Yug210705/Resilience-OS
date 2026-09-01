import os
import re

def fix_next_params(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Only process if we see { params }: { params: { id: string } }
    if "{ params }: { params: { id: string } }" in content:
        # 1. Add `import { use } from 'react';` if not there
        if "import { use }" not in content and "import { use," not in content and "import { useEffect, use }" not in content:
            if "import { useEffect" in content:
                content = content.replace("import { useEffect", "import { useEffect, use")
            elif "import { useState, useEffect" in content:
                content = content.replace("import { useState, useEffect", "import { useState, useEffect, use")
            else:
                # just prepend it
                content = "import { use } from 'react';\n" + content
                
        # 2. Change signature
        content = content.replace("{ params }: { params: { id: string } }", "{ params }: { params: Promise<{ id: string }> }")
        
        # 3. Inject `const { id } = use(params);` right after the function declaration
        # We need to find the function declaration.
        # It's usually `export default function SomePage({ params }: { params: Promise<{ id: string }> }) {`
        pattern = r"(export default function \w+\({ params }: \{ params: Promise<\{ id: string \}> \}\) \{)"
        replacement = r"\1\n  const { id } = use(params);"
        content = re.sub(pattern, replacement, content)
        
        # 4. Replace `params.id` with `id`
        content = content.replace("params.id", "id")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

# Paths to fix
files = [
    "frontend/src/app/live-demo/[id]/page.tsx",
    "frontend/src/app/disruptions/[id]/page.tsx",
    "frontend/src/app/recovery/[id]/page.tsx",
    "frontend/src/app/risk/[id]/page.tsx",
    "frontend/src/app/approvals/[id]/page.tsx"
]

for f in files:
    fix_next_params(f)
