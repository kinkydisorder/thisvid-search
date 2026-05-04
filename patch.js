const fs = require('fs');
const file = 'src/hooks/useSearchLogic.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /    } catch \(error\) {\n      console\.error\('Error:', error\);\n    }/,
  '    } catch {\n      // Silently handle search execution errors\n    }'
);
fs.writeFileSync(file, code);
