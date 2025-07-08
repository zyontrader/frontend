import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";

function DetailedNews() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const news = state?.news;

  if (!news) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        No news data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col gap-4 lg:block">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-5 w-25"
        >
          Go Back
        </Button>
      <div className="max-w-4xl mx-auto">

        {/* News Image */}
        {news.image_url && (
          <img
            src={news.image_url}
            alt="news"
            className="w-full max-h-[400px] object-cover rounded-xl mb-6"
          />
        )}

        {/* News Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{news.title}</h1>

        {/* Description */}
        <p className="text-gray-300 text-base md:text-lg mb-6">
          {news.description || "No description available."}
        </p>

        {/* Sentiment Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Tag color="green">
            <SmileOutlined /> Positive: {news.sentiment_stats?.positive || 0}
          </Tag>
          <Tag color="orange">
            <MehOutlined /> Neutral: {news.sentiment_stats?.neutral || 0}
          </Tag>
          <Tag color="red">
            <FrownOutlined /> Negative: {news.sentiment_stats?.negative || 0}
          </Tag>
        </div>

        {/* News Content */}
        {news.content && (
          <div className="text-gray-200 leading-7 text-base md:text-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">Content</h2>
            <p>{news.content}</p>
          </div>
        )}

        {/* Publication Date */}
        {news.pubDate && (
          <p className="mt-6 text-sm text-gray-400">
            Published on: {new Date(news.pubDate).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default DetailedNews;
