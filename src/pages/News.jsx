import axios from "axios";
import { useEffect, useState } from "react";
import NewsCard from './../components/News/NewsCard';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNews() {
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=in&category=business`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data.status !== "success") throw new Error("Failed to fetch news");
      setNews(data.results);
    } catch (error) {
      console.log("Error : ", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex  items-center justify-center bg-gray-900">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 60, color: "white" }} spin />
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-5 h-full flex flex-col md:flex-row flex-wrap justify-evenly gap-6">
      {news.map((article, index) => (
        <NewsCard key={index} news={article} />
      ))}
    </div>
  );
}

export default News;
