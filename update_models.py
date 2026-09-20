import sys
import re

def update_models(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Uppercase __tablename__ = 'xxx'
    content = re.sub(r"__tablename__ = '([a-z_]+)'", lambda m: f"__tablename__ = '{m.group(1).upper()}'", content)

    # Uppercase ForeignKey('xxx.yyy')
    content = re.sub(r"ForeignKey\('([a-z_]+)\.([a-z_]+)'\)", lambda m: f"ForeignKey('{m.group(1).upper()}.{m.group(2)}')", content)

    with open(filepath, 'w') as f:
        f.write(content)
    print('Updated', filepath)

update_models('backend/impact-engine/app/models/__init__.py')
update_models('backend/ai-sap-service/app/models/__init__.py')
