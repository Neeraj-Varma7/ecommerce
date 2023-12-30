import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Form, FormControl, FormLabel } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation,
} from "../slices/productApiSlice";
import FormContainer from "../components/FormContainer";

const ProductEditScreen = () => {
    const { id: productId } = useParams('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage,
    {isLoading: loadingUpload}] = useUploadProductImageMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        };

        const result = await updateProduct(updatedProduct);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Product updated')
            navigate('/admin/productlist');
        }
    }

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);
    
    const uploadFileHandler = async (e) => {
        
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error.message);
        }
    };
  return (
      <>
          <Link to='/admin/productlist' className="btn btn-light my-3">
              Go Back
          </Link>
          <FormContainer>
              <h1>Edit Product</h1>
              {loadingUpdate && <Loader />}
              
              {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                  <Form onSubmit={submitHandler}>
                      <Form.Group controlId="name">
                          <FormLabel>Name</FormLabel>
                          <FormControl
                              type='text'
                              placeholder="Enter name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId="price">
                          <FormLabel>Price</FormLabel>
                          <FormControl
                              type='number'
                              placeholder="Enter price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId='image' className="my-2">
                          <Form.Label>Image</Form.Label>
                          <Form.Control type="text" placeholder="Enter image url"
                              value={image} onChange={(e) => setImage(e.target.value)}>
                              
                          </Form.Control>
                          <FormControl type='file' label='Choose file' onChange={uploadFileHandler}>
                              
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId="brand">
                          <FormLabel>Brand</FormLabel>
                          <FormControl
                              type='text'
                              placeholder="Enter brand"
                              value={brand}
                              onChange={(e) => setBrand(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId="countInStock">
                          <FormLabel>Count in Stock</FormLabel>
                          <FormControl
                              type='number'
                              placeholder="Enter countInStock"
                              value={countInStock}
                              onChange={(e) => setCountInStock(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId="category">
                          <FormLabel>Category</FormLabel>
                          <FormControl
                              type='text'
                              placeholder="Enter Category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Form.Group controlId="description">
                          <FormLabel>Description</FormLabel>
                          <FormControl
                              type='text'
                              placeholder="Enter Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}>
                          </FormControl>
                      </Form.Group>

                      <Button
                          type='submit'
                          variant="primary"
                          className="my-2">
                          Update
                      </Button>
                      
                  </Form>
              )}
          </FormContainer>
      </>
  )
}

export default ProductEditScreen;