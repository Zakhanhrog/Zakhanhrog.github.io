import React, { useState, useEffect } from 'react';
import { getCategories, deleteCategory } from '../services/api';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            toast.error('Không thể tải dữ liệu danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await deleteCategory(categoryToDelete.id);
                toast.success(`Đã xóa danh mục "${categoryToDelete.name}"`);
                setShowDeleteModal(false);
                setCategoryToDelete(null);
                fetchCategories();
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa danh mục.');
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title mb-0">Danh mục</h1>
                <Link to="/categories/add">
                    <Button variant="primary">
                        <FaPlus /> Thêm mới
                    </Button>
                </Link>
            </div>

            <div className="table-container">
                <Table hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
                            <th className="text-end">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td className="text-end">
                                    <Link to={`/categories/edit/${category.id}`}><Button variant="light" size="sm" className="me-2"><FaEdit /></Button></Link>
                                    <Button variant="light" size="sm" onClick={() => handleDeleteClick(category)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                message={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không?`}
            />
        </>
    );
};

export default CategoryList;