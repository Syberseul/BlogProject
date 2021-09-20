const getList = (author, keyword) => {
  // 先返回假数据 (格式是正确的)
  return [
    {
      id: 1,
      title: "title A",
      content: "content A",
      createTime: 1632101849601,
      author: "Author A",
    },
    {
      id: 2,
      title: "title B",
      content: "content B",
      createTime: 1632101899530,
      author: "Author B",
    },
  ];
};

const getDetail = (id) => {
  // 先返回假数据 (格式是正确的)
  return {
    id: 1,
    title: "title A",
    content: "content A",
    createTime: 1632101849601,
    author: "Author A",
  };
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content 属性
  return {
    id: 3, // 表示新建博客，插入到数据表里的id
  };
};

const updateBlog = (id, blogData = {}) => {
  // id 是要更新博客的 id
  // blogData 是一个博客对象，包含 title content 属性

  return true;
};

const delBlog = (id) => {
  // id 是要删除博客的 id

  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
