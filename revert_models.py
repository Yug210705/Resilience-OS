import sys
import re

def revert_models(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Lowercase __tablename__ = 'XXX'
    content = re.sub(r"__tablename__ = '([A-Z_]+)'", lambda m: f"__tablename__ = '{m.group(1).lower()}'", content)

    # Lowercase ForeignKey('XXX.yyy')
    content = re.sub(r"ForeignKey\('([A-Z_]+)\.([a-z_]+)'\)", lambda m: f"ForeignKey('{m.group(1).lower()}.{m.group(2)}')", content)

    with open(filepath, 'w') as f:
        f.write(content)
    print('Reverted', filepath)

revert_models('backend/impact-engine/app/models/__init__.py')
revert_models('backend/ai-sap-service/app/models/__init__.py')
