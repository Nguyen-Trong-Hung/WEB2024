import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Kết quả tìm kiếm <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Địa chỉ</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Thành phố"
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Phương thức</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">Tùy chọn</option>
            <option value="buy">Mua</option>
            <option value="rent">Mượn</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Loại</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">Tùy chọn</option>
            <option value="apartment">Căn hộ</option>
            <option value="house">Ngôi nhà</option>
            <option value="condo">Chung cư</option>
            <option value="land">Đất</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Giá thấp nhất</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Tùy chọn"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Giá cao nhất</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="Tùy chọn"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Phòng ngủ</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Tùy chọn"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
