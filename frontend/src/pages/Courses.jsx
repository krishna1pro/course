import React, { useEffect, useState } from 'react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading courses...</div>;
  if (courses.length === 0) return <div className="text-center mt-5">No active courses found.</div>;

  return (
    <div className="container mt-5">
      <h2>Courses</h2>
      <div className="row mt-3">
        {courses.map((course, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{course.Title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{course.Category}</h6>
                <p className="card-text">{course.Description}</p>
                <p className="card-text">Price: ${course.Price}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${course.VideoFileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-2"
                >
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
