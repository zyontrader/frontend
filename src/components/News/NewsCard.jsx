import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Link } from "react-router";
const { Meta } = Card;

function NewsCard({ news }) {
  return (
    <Link to={`/news/${encodeURIComponent(news.title)}`} state={{ news }}>
      <Card
        hoverable
        className="flex flex-col justify-between"
        style={{
          width: 300,
          height: 350,
          display: "flex",
          flexDirection: "column",
        }}
        cover={
          <div className="h-40 overflow-hidden">
            <img
              src={news.image_url}
              alt="news"
              className="w-full h-full object-cover"
            />
          </div>
        }
        actions={[
          <span className="text-gray-800">
            <SmileOutlined style={{ color: "green", fontSize: 24 }} />{" "}
            {news.sentiment_stats?.positive || 0}
          </span>,
          <span className="text-gray-800">
            <MehOutlined style={{ color: "orange", fontSize: 24 }} />{" "}
            {news.sentiment_stats?.neutral || 0}
          </span>,
          <span className="text-gray-800">
            <FrownOutlined style={{ color: "red", fontSize: 24 }} />{" "}
            {news.sentiment_stats?.negative || 0}
          </span>,
        ]}
      >
        <Meta
          title={
            <div className="text-base font-semibold truncate">{news.title}</div>
          }
          description={
            <div className="text-sm text-gray-600 line-clamp-3">
              {news.description || "No description available"}
            </div>
          }
        />
      </Card>
    </Link>
  );
}

export default NewsCard;
