import React, { useState } from 'react';
import Axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const CreatePost = ({ userId, userName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('post');

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean'],                                         // remove formatting
    ['image']                                         // image button
  ];
  
  const modules = {
    toolbar: toolbarOptions
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the post to the server
    Axios.post("http://localhost:3001/createPost", {
        title: title,
        content: content,
        postType: postType,
        user_id: userId,
        user_name: userName
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error("Error creating post:", error);
        });
  };

  return (
    <div className="create-post">
      <h2>Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Content:</label>
        <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}  
        />
        <label>Post Type:</label>
        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
          <option value="post">Post</option>
          <option value="market">Market</option>
        </select>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;