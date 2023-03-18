import { useState } from 'react';
import BlogList from './BlogList';

const Home = () => {

    const [blogs, setBlogs] = useState([
        { title: 'My new website', body: 'lorem ipsum...', author: 'mario', id:1 },
        { title: 'Elte News', body: 'Nothing too much...', author: 'Jerry', id:2 },
        { title: 'Club day', body: 'Join us...', author: 'Jack', id:3 }
    ]);


    return ( 
        <div className="home">
            <BlogList blogs={blogs} title="All Blogs!" />
            <BlogList blogs={blogs.filter((blog)=>blog.author === 'mario')} title="Mario's Blogs!" />

        </div>
     );
}
 
export default Home;