import axios from 'axios';
import React from 'react';
import CategoryService from '../../Services/CategoryServices';

class PostsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      categories: [],
      query: {
        page: 1,
        category_id: '',
        order_column: 'id',
        order_direction: 'desc',
      },
    };
  }

  fetchPost(page = 1) {
    axios
      .get('/api/posts', { params: this.state.query })
      .then((resp) => this.setState({ posts: resp.data }));
  }

  //   fetchCategories() {
  //     axios
  //       .get('/api/categories')
  //       .then((resp) => this.setState({ categories: resp.data.data }));
  //   }

  pageTracking = (url) => {
    const fullUrl = new URL(url);
    this.setState(
      {
        query: {
          page: fullUrl.searchParams.get('page'),
        },
      },
      () => {
        this.fetchPost();
      },
    );
  };

  categoryTracking = (event) => {
    // this.state.query.category_id = category_id;
    this.setState(
      {
        query: {
          category_id: event.target.value,
          page: 1,
        },
      },
      () => {
        this.fetchPost();
      },
    );
  };

  componentDidMount() {
    this.fetchPost();
    //   this.fetchCategories();
    CategoryService.getAll().then((resp) =>
      this.setState({ categories: resp.data.data }),
    );
  }

  renderPost = () => {
    const { posts } = this.state;
    return posts.data.map((post) => (
      <tr key={post.id}>
        <td>{post.id}</td>
        <td>{post.title}</td>
        <td>{post.category.name}</td>
        <td>{post.content}</td>
        <td>{post.created_at}</td>
      </tr>
    ));
  };

  renderCategoryFilter = () => {
    const categories = this.state.categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
    return (
      <select
        onChange={this.categoryTracking}
        className="mt-1 w-full sm:mt-0 sm:w-1/4 rounded-md shadow-sm border-gray-300 focus:border-indigo-300"
      >
        <option>All Category</option>
        {categories}
      </select>
    );
  };

  /*
  ======================================== Output
{"meta":{"current_page":1,"from":1,"last_page":20,"links":[{"url":null,"label":"&laquo; Previous","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=1","label":"1","active":true},{"url":"http://127.0.0.1:8000/api/posts?page=2","label":"2","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=3","label":"3","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=4","label":"4","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=5","label":"5","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=6","label":"6","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=7","label":"7","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=8","label":"8","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=9","label":"9","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=10","label":"10","active":false},{"url":null,"label":"...","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=19","label":"19","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=20","label":"20","active":false},{"url":"http://127.0.0.1:8000/api/posts?page=2","label":"Next &raquo;","active":false}],"path":"http://127.0.0.1:8000/api/posts","per_page":10,"to":10,"total":200}}
================================================
*/

  renderPages = () => {
    const { posts } = this.state;
    return (
      <nav className="flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700 leading-5">
            Showing from
            <span>
              <span className="font-medium"> {posts.meta.from} </span>
              to
              <span className="font-medium"> {posts.meta.to} </span>
            </span>
            of
            <span className="font-medium"> {posts.meta.total} </span>
            <span className="">{this.renderPageSelector()}</span>
          </div>
        </div>
      </nav>
    );
  };

  renderPageSelector = () => {
    const { posts } = this.state;
    return posts.meta.links.map((selectors, index) => (
      <button
        key={index}
        className="relative inline-flex items-center px-4 py-4 -ml-px border-gray-400 transition ease-in-out duration-150 first:rounded-l-md last:rounded-r-md"
        dangerouslySetInnerHTML={{ __html: selectors.label }}
        onClick={() => this.pageTracking(selectors.url)}
      />
    ));
  };

  orderIcon = (column) => {
    let icon = 'fa-sort';
    const { query } = this.state;
    if (query.order_column === column) {
      query.order_direction === 'asc'
        ? (icon = 'fa-sort-up')
        : (icon = 'fa-sort-down');
    }

    return <i className={`fa-solid ${icon}`}></i>;
  };

  updateOrder = (column) => {
    const { query } = this.state;
    let direction = 'asc';
    if (column === query.order_column) {
      direction = query.order_direction === 'asc' ? 'desc' : 'asc';
    }
    this.setState(
      {
        query: {
          page: 1,
          order_column: column,
          order_direction: direction,
        },
      },
      () => this.fetchPost(),
    );
  };

  render() {
    if (!('data' in this.state.posts)) return;
    return (
      <div className="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
        <div className="min-w-full align-middle">
          <div className="mb-4">{this.renderCategoryFilter()}</div>
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>
                  <div>
                    <span>ID</span>
                    <button
                      onClick={() => this.updateOrder('id')}
                      type="button"
                      className="column-sort"
                    >
                      {this.orderIcon('id')}
                    </button>
                  </div>
                </th>
                <th>
                  <div>
                    <span>Title</span>
                    <button
                      onClick={() => this.updateOrder('title')}
                      type="button"
                      className="column-sort"
                    >
                      {this.orderIcon('title')}
                    </button>
                  </div>
                </th>
                <th>
                  <div>
                    <span>Category</span>
                  </div>
                </th>
                <th>
                  <div>
                    <span>Content</span>
                  </div>
                </th>
                <th>
                  <div>
                    <span>Created At</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="table-body">{this.renderPost()}</tbody>
          </table>
          <div className="mt-4">{this.renderPages()}</div>
        </div>
      </div>
    );
  }
}

export default PostsIndex;
