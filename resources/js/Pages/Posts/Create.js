import React from 'react';
import CategoryService from '../../Services/CategoryServices';
import { useNavigate } from 'react-router-dom';

export const withNavigate = (Component) => {
  return (props) => <Component {...props} navigate={useNavigate()} />;
};
class PostCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      category_id: '',
      categories: [],
      error: {},
    };
  }

  componentDidMount() {
    CategoryService.getAll().then((resp) =>
      this.setState({ categories: resp.data.data }),
    );
  }

  handleTitleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  handleContentChange = (event) => {
    this.setState({
      content: event.target.value,
    });
  };

  handleCategoryChange = (event) => {
    this.setState({
      category_id: event.target.value,
    });
  };

  errorMessage = (field) => {
    const { errors } = this.state;
    return (
      <div className="text-red-600 mt-2">
        {errors?.[field]?.map((message, index) => {
          return <div key={index}>{message}</div>;
        })}
      </div>
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('/api/posts', {
        title: this.state.title,
        content: this.state.content,
        category_id: this.state.category_id,
      })
      .then((resp) => this.props.navigate('/'))
      .catch((error) =>
        this.setState({
          errors: error.resp.data.errors,
        }),
      );

    console.log('success');
  };

  render() {
    const { title, content, category_id, categories } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="block font-medium text-sm text-gray-700"
          >
            Title
          </label>
          <input
            value={title}
            onChange={this.handleTitleChange}
            id="title"
            type="text"
            className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {this.errorMessage('title')}
        </div>
        <div className="mt-4">
          <label
            htmlFor="content"
            className="block font-medium text-sm text-gray-700"
          >
            Content
          </label>
          <textarea
            value={content}
            onChange={this.handleContentChange}
            id="content"
            type="text"
            className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {this.errorMessage('content')}
        </div>
        <div className="mt-4">
          <label
            htmlFor="category"
            className="block font-medium text-sm text-gray-700"
          >
            Category
          </label>
          <select
            value={category_id}
            onChange={this.handleCategoryChange}
            id="category"
            className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">-- Select category --</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {this.errorMessage('category_id')}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default withNavigate(PostCreate);
