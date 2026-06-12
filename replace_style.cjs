const fs = require('fs');
const path = require('path');

const dir = 'd:/EduFinace/src/views';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace standard style
    content = content.replace(
      /<div style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*marginBottom:\s*'2rem'\s*\}\}>/g,
      '<div className="page-header">'
    );

    // Replace no-print variant
    content = content.replace(
      /<div className="no-print" style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*marginBottom:\s*'2rem'\s*\}\}>/g,
      '<div className="page-header no-print">'
    );

    // Replace TransaksiPembayaran variant
    content = content.replace(
      /<div style=\{\{\s*marginBottom:\s*'2rem',\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center'\s*\}\}>/g,
      '<div className="page-header">'
    );

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('done');
