// src/pages/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getCategories } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '', image: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const isEditing = Boolean(id);

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };

    fetchCategories();

    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await getProductById(id);
          setProduct(response.data);
        } catch (error) {
          console.error('Lỗi khi tải sản phẩm:', error);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(id, product);
      } else {
        await createProduct(product);
      }
      navigate('/products');
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
    }
  };

  return (
    <Card>
        <Card.Header as="h2">{isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</Card.Header>
        <Card.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formProductName">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control type="text" name="name" value={product.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductDescription">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={product.description} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductPrice">
                <Form.Label>Giá</Form.Label>
                <Form.Control type="number" name="price" value={product.price} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductImage">
                <Form.Label>URL Hình ảnh</Form.Label>
                <Form.Control type="text" name="image" value={product.image} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductCategory">
                <Form.Label>Danh mục</Form.Label>
                <Form.Control as="select" name="categoryId" value={product.categoryId} onChange={handleChange} required>
                    <option value="">Chọn một danh mục</option>
                    {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/products')} className="ms-2">
                    Hủy
                </Button>
            </Form>
        </Card.Body>
    </Card>
  );
};

export default ProductForm;