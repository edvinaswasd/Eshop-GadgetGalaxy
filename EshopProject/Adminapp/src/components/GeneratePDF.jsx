import { Grid } from '@material-ui/core';
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react'
import HeaderAndLayout from './layouts/HeaderAndLayout';

function GeneratePDF() {
  const url = process.env.REACT_APP_BE_URL;
  const [products, setProducts] = useState([])
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Alice', age: 25, city: 'San Francisco' },
    { name: 'Bob', age: 40, city: 'Los Angeles' }
  ];


  const getProducts = async () => {
    try {
      const res = await axios.get(`${url}/admin/getallproducts`);
      if (res.status === 201) {
        setProducts(res?.data?.productList)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProducts()

  }, [])

  const tableRef = useRef(null);

  const downloadPdf = () => {
    const html = tableRef.current.outerHTML;
    const doc = new jsPDF('p', 'pt', 'a4', true);
    doc.html(html, {
      callback: function () {
        doc.save('table.pdf');
      }
    });
  };

  return (
    <div>
      <Grid style={{ marginLeft: "11rem", marginTop: "1.5rem" }}>
        <HeaderAndLayout activeItem={"pdf"} />
        <table ref={tableRef} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ margin: '30px', width: '100px', padding: '5px' }}>Id</th>
              <th style={{ margin: '30px', width: '200px', padding: '5px' }}>Name</th>
              <th style={{ margin: '30px', width: '200px', padding: '5px' }}>Category</th>
              <th style={{ margin: '30px', width: '100px', padding: '5px' }}>Price</th>
              <th style={{ margin: '30px', width: '400px', padding: '5px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, index) => (
              <tr key={index}>
                <td style={{ margin: '30px', width: '100px', padding: '5px' }}>{item.id}</td>
                <td style={{ margin: '30px', width: '100px', padding: '5px' }}>{item.name}</td>
                <td style={{ margin: '30px', width: '100px', padding: '5px' }}>{item.category}</td>
                <td style={{ margin: '30px', width: '100px', padding: '5px' }}>{item.price}</td>
                <td style={{ margin: '30px', width: '100px', padding: '5px' }}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={downloadPdf} style={{ margin: '30px', background: 'lightblue', borderRadius: '6px', padding: '20px' }}>Download PDF</button>
      </Grid>
    </div>
  );
}

export default GeneratePDF