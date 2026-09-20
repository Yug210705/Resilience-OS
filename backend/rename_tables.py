import re
content = open('app/db/models.py').read()
content = re.sub(r'__tablename__ = "(.*)"', r'__tablename__ = "res_\1"', content)
open('app/db/models.py', 'w').write(content)
