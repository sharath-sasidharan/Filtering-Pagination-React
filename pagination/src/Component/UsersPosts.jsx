import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

const pageSize = 10;

const UserPosts = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedPosts, setPaginatedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    console.log(res.data);
    setUsers(res.data);
    setPaginatedPosts(_(res.data).slice(0).take(pageSize).value());
  };

  const pageCount = users ? Math.ceil(users.length / pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedPost = _(users).slice(startIndex).take(pageSize).value();
    setPaginatedPosts(paginatedPost);
  };

  return (
    <div>
      <input
        className="form-control"
        type="search"
        style={{
          marginTop: 50,
          marginBottom: 20,
          marginLeft: 40,
          width: "40%",
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>body</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                val.body.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            .map((user, ind) => {
              return (
                <tr key={ind}>
                  <td>{user.id}</td>
                  <td>{user.title}</td>
                  <td>{user.body}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <nav className="d-flex  justify-content-center">
        <ul className="pagination">
          {pages.map((page) => (
            <li
              style={{ cursor: "pointer" }}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <p className="page-link" onClick={() => pagination(page)}>
                {page}
              </p>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserPosts;
