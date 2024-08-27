import React, { useEffect, useState } from 'react';
import axios from "axios"
import xmlbuilder from 'xmlbuilder';
import { Grid } from '@material-ui/core';
import HeaderAndLayout from './layouts/HeaderAndLayout';

const GenerateXML = () => {
  let productsXmlString = '';
  let usersXmlString = '';
  let cartlistXmlString = '';
  const url = process.env.REACT_APP_BE_URL;
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [cartList, setCartList] = useState([])
  const [showProducts, setShowProducts] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [showCartList, setShowCartList] = useState(false)


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

  const getUsers = async () => {
    try {
      const res = await axios.get(`${url}/admin/getallusers`);
      if (res.status === 201) {
        setUsers(res?.data?.userList)
      }
    } catch (err) {
      console.log(err)
    }

  }
  const getCartlist = async () => {
    try {
      const res = await axios.get(`${url}/admin/getcartlist`);
      if (res.status === 201) {
        setCartList(res?.data?.cartList)
      }
    } catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    getProducts()
    getUsers()
    getCartlist()
  }, [])

  useEffect(() => {

  }, [])



  if (products.length !== 0) {
    const xml = xmlbuilder.create('products');
    // eslint-disable-next-line no-unused-expressions
    products?.map((product) => {
      const userElement = xml.ele('product').att('id', product.id);
      userElement.ele('name').text(product.name);
      userElement.ele('price').text(product.price);
    });

    productsXmlString = xml.end({ pretty: true });

  }

  if (users?.length !== 0) {
    const xml = xmlbuilder.create('users');

    // eslint-disable-next-line no-unused-expressions
    users?.forEach((user) => {
      const userElement = xml.ele('user').att('email', user.email);
      userElement.ele('first_name').text(user.fname);
      // userElement.ele('last_name').text(user.lanme);
    });

    usersXmlString = xml.end({ pretty: true });

  }

  if (cartList?.length !== 0) {
    const xml = xmlbuilder.create('products');

    // eslint-disable-next-line no-unused-expressions
    cartList?.forEach((item) => {
      const userElement = xml.ele('product').att('id', item.productId);
      userElement.ele('name').text(item.productName);
      userElement.ele('price').text(item.productPrice);
      userElement.ele('category').text(item.productCategory);
      userElement.ele('description').text(item.description);
      userElement.ele('userEmail').text(item.userEmail);
    });

    cartlistXmlString = xml.end({ pretty: true });

  }

  const handleShow = (type) => {
    if (type === "products") {
      setShowProducts(true)
      setShowCartList(false)
      setShowUsers(false)
    }
    if (type === "users") {
      setShowProducts(false)
      setShowCartList(false)
      setShowUsers(true)
    }
    if (type === "cartlist") {
      setShowProducts(false)
      setShowCartList(true)
      setShowUsers(false)
    }

  }

  const downloadXml = (xmlContent) => {
    const element = document.createElement('a');
    const file = new Blob([xmlContent], { type: 'text/xml' });
    element.href = URL.createObjectURL(file);
    element.download = 'note.xml';
    document.body.appendChild(element);
    element.click();
  };


  return (
    <div >
      <Grid style={{ marginLeft: "11rem", marginTop: "1.5rem" }}>
        <HeaderAndLayout activeItem={"xml"} />
        <div style={{ marginBottom: '30px' }}>
          <button style={{ marginLeft: '20px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} onClick={() => handleShow('products')}>Generate Products XML File</button>
          <button style={{ marginLeft: '20px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} onClick={() => handleShow('users')}>Generate Users XML File</button>
          <button style={{ marginLeft: '20px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} onClick={() => handleShow('cartlist')}>Generate Cartlist XML File</button>
        </div>
        {showProducts && (
          <div>
            <pre>{productsXmlString}</pre>
            <button onClick={() => downloadXml(productsXmlString)} style={{ margin: '30px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} >Download XML</button>
          </div>)
        }
        {showUsers && (
          <div>
            <pre>{usersXmlString}</pre>
            <button onClick={() => downloadXml(usersXmlString)} style={{ margin: '30px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} >Download XML</button>
          </div>)}
        {showCartList &&
          (<div>
            <pre>{cartlistXmlString}</pre>
            <button onClick={() => downloadXml(cartlistXmlString)} style={{ margin: '30px', background: 'lightblue', borderRadius: '6px', padding: '20px' }} >Download XML</button>
          </div>)}
      </Grid>
    </div>
  );


}

export default GenerateXML;