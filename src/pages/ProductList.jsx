import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, deleteProduct, getCategories } from '../services/api';
import { Table, Button, Pagination, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const productsPerPage = 5;

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const catRes = await getCategories();
            const categoryMap = catRes.data.reduce((acc, category) => {
                acc[category.id] = category.name;
                return acc;
            }, {});
            setCategories(categoryMap);

            const params = {
                _page: currentPage,
                _limit: productsPerPage,
                _sort: 'price',
                _order: sortOrder,
                q: searchTerm || undefined,
            };
            const prodRes = await getProducts(params);
            setProducts(prodRes.data);
            const totalCount = prodRes.headers['x-total-count'];
            setTotalPages(Math.ceil(totalCount / productsPerPage));
        } catch (error) {
            toast.error('Không thể tải dữ liệu sản phẩm.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, sortOrder]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete.id);
                toast.success(`Đã xóa sản phẩm "${productToDelete.name}"`);
                setShowDeleteModal(false);
                setProductToDelete(null);
                fetchAllData();
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa sản phẩm.');
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
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h1 className="page-title mb-0">Sản phẩm</h1>
                <div className="d-flex align-items-center gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        style={{ width: '240px' }}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button variant="outline-secondary" className="flex-shrink-0" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                    </Button>
                    <Link to="/products/add">
                        <Button variant="primary" className="flex-shrink-0">
                            <FaPlus /> Thêm mới
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="table-container">
                <Table hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Danh mục</th>
                            <th className="text-end">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td><img src={product.image} alt={product.name} className="product-image" /></td>
                                <td>{product.name}</td>
                                <td>{new Intl.NumberFormat('vi-VN').format(product.price)}đ</td>
                                <td>{categories[product.categoryId] || 'N/A'}</td>
                                <td className="text-end">
                                    <Link to={`/products/edit/${product.id}`}><Button variant="light" size="sm" className="me-2"><FaEdit /></Button></Link>
                                    <Button variant="light" size="sm" onClick={() => handleDeleteClick(product)}><FaTrash /></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    <Alert variant="secondary" className="mb-0">Không có sản phẩm nào.</Alert>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            )}

            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}" không?`}
            />
        </>
    );
};

export default ProductList;