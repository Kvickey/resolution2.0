import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup, Collapse } from 'react-bootstrap';
import './Sidebar.css';
import { useAuth } from './AuthProvider';

const Sidebar = ({ menuItems, user, onMenuItemClick, isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});
    const [activeItem, setActiveItem] = useState('');

    const { user: authUser, logout } = useAuth();

    // console.log(authUser[0].User_name);

    useEffect(() => {
        const currentPath = location.pathname;
        menuItems.forEach((item) => {
            if (item.link === currentPath) {
                setActiveItem(item.name);
            }
            if (item.submenu) {
                item.submenu.forEach((subitem) => {
                    if (subitem.link === currentPath) {
                        setActiveItem(subitem.name);
                    }
                });
            }
        });
    }, [location.pathname, menuItems]);

    const toggleMenu = (index) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const handleMenuItemClick = (item) => {
        setActiveItem(item.name);
        onMenuItemClick(item.name);
    };

    return (
        <div className={`${isOpen ? "" : "sideCollapse"} sidebar min-vh-100`} style={{ fontFamily: 'Roboto, sans-serif' }}>
            <h2 className={`sidebar-h2 text-center pt-2`}>{isOpen ? authUser[0].User_name : ""}</h2>
            <button className="toggle-button" onClick={toggleSidebar}>
                <div></div>
                <div></div>
                <div></div>
            </button>

            <div>
                <ListGroup className={`cust-bg mt-3 `}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.submenu ? (
                                <ListGroup.Item
                                    className={`cust-item d-flex align-items-center ${activeItem === item.name ? 'active' : ''}`}
                                    onClick={() => {
                                        toggleMenu(index);
                                        handleMenuItemClick(item);
                                    }}
                                >
                                    <span className="material-icons pe-3 ">{item.icon}</span>
                                    <span className={`sidebar-option `}>{item.name} &#9660;</span>
                                </ListGroup.Item>
                            ) : (
                                <ListGroup.Item
                                    className={`cust-item d-flex align-items-center ${activeItem === item.name ? 'active' : ''}`}
                                    onClick={() => handleMenuItemClick(item)}
                                >
                                    <Link className='text-decoration-none cust-link d-flex align-items-center' to={item.link}>
                                        <span className="material-icons pe-3">{item.icon}</span>
                                        <span className='sidebar-option'>{item.name}</span>
                                    </Link>
                                </ListGroup.Item>
                            )}
                            {item.submenu && (
                                <Collapse in={openMenus[index]}>
                                    <ListGroup className="submenu">
                                        {item.submenu.map((subitem, subindex) => (
                                            <ListGroup.Item
                                                className={`cust-item ${activeItem === subitem.name ? 'active' : ''}`}
                                                key={subindex}
                                                onClick={() => handleMenuItemClick(subitem)}
                                            >
                                                <Link className='text-decoration-none cust-link d-flex align-items-center ms-2' to={subitem.link}>
                                                    <span className="material-icons pe-3">{subitem.icon}</span>
                                                    <span className='sidebar-option'>{subitem.name}</span>
                                                </Link>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            link: PropTypes.string,
            submenu: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    link: PropTypes.string.isRequired,
                    icon: PropTypes.string.isRequired
                })
            )
        })
    ).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
