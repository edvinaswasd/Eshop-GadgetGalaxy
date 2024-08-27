import pdfMake from "pdfmake/build/pdfmake";

import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function generatePDf(data,id) {
  const dd = {
    content: [
      {
        text: `${data.name}`,
        style: "header",
        alignment: "center",
      },

      { 
          qr:`http://localhost:3001/restaurant/${id}/qr`,
          alignment: "center",
          margin: [ 0, 100, 0, 0 ],
          fit: '200'
      },

      {
        text: 'Powered by GottaMenu' ,
        style: "footer",
        alignment: "center",
      }
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      footer: {
         margin:[0,10,0,0] 
      }
    },
  };

  return dd;
}

export default generatePDf;
