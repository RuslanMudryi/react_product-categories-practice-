/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(element => element.id === product.categoryId) ||
    {}; // find by product.categoryId
  const user =
    usersFromServer.find(element => element.id === category.ownerId) || {}; // find by category.ownerId

  return { ...product, user, category };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);

  const filteredProducts = products
    .filter(product => !selectedUser || selectedUser === product.user.id)
    .filter(product => product.name.toLowerCase().includes(query))
    .filter(product =>
      activeCategories.length === 0
        ? true
        : // eslint-disable-next-line comma-dangle, prettier/prettier
        activeCategories.includes(product.categoryId));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!selectedUser && 'is-active'}
                onClick={() => {
                  setSelectedUser(null);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUser === user.id && 'is-active'}
                  onClick={() => {
                    setSelectedUser(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value.toLowerCase());
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query.length !== 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${activeCategories.length !== 0 && 'is-outlined'}`}
                onClick={() => {
                  setActiveCategories([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${activeCategories.includes(category.id) && 'is-info'}`}
                  href="#/"
                  onClick={() => {
                    if (!activeCategories.includes(category.id))
                      setActiveCategories([...activeCategories, category.id]);
                    else {
                      const indexToDelete = activeCategories.findIndex(
                        categoryId => categoryId === category.id,
                      );
                      const newArray = [
                        ...activeCategories.slice(0, indexToDelete),
                        ...activeCategories.slice(
                          indexToDelete,
                          activeCategories.length - 1,
                        ),
                      ];

                      setActiveCategories([...newArray]);
                    }
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setActiveCategories([]);
                  setSelectedUser(null);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={
                          product.user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
