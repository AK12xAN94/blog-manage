export default function HomeContent() {
  return (
    <div className="welcome-section">
      <h2 className="welcome-title">欢迎来到知否在线博客论坛</h2>
      <div className="hero-card">
        <div className="hero-content">
          <h1 className="hero-title">知否技术</h1>
          <p className="hero-subtitle">让技术更简单</p>
          <div className="search-bar">
            <input type="text" placeholder="搜索文章..." />
            <button className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20cartoon%20students%20studying%20at%20desk%20with%20books%20minimal%20style%20purple%20background&image_size=landscape_4_3"
            alt="Welcome"
          />
        </div>
      </div>
    </div>
  )
}
