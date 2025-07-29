// src/pages/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '' });
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        try {
          const response = await getCategoryById(id);
          setCategory(response.data);
        } catch (error) {
          console.error('Lỗi khi tải danh mục:', error);
        }
      };
      fetchCategory();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(id, category);
      } else {
        await createCategory(category);
      }
      navigate('/categories');
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
    }
  };

  return (
    <Card>
        <Card.Header as="h2">{isEditing ? 'Sửa Danh mục' : 'Thêm Danh mục'}</Card.Header>
        <Card.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formCategoryName">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control type="text" name="name" value={category.name} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/categories')} className="ms-2">
                    Hủy
                </Button>
            </Form>
        </Card.Body>
    </Card>
  );
};


export default CategoryForm;