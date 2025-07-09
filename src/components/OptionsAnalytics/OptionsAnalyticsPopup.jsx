import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { optionAnalysis } from '../../api/apis';
import OptionsAnalyticsWidget from './OptionsAnalyticsWidget';

const OptionsAnalyticsPopup = ({
  visible,
  onClose,
  includePositions = false,
  basketId = null
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (visible) {
      const loadAnalyticsData = async () => {
        setLoading(true);
        setError(null);
        setAnalyticsData(null);

        try {
          const analysisData = includePositions
            ? {
              analysisPositions: [],
              dateTime: new Date().toISOString(),
              ivUpdate: 0.0
            }
            : {
              analysisPositions: null,
              dateTime: new Date().toISOString(),
              ivUpdate: 0.0
            };

          const response = await optionAnalysis(basketId, analysisData);
          const dataCopy = JSON.parse(JSON.stringify(response.optionAnalysis));
          setAnalyticsData(dataCopy);
        } catch (err) {
          console.error('Failed to load analytics data:', err);
          setError(err.message || 'Failed to load analytics data');
        } finally {
          setLoading(false);
        }
      };
      loadAnalyticsData();
    }
  }, [visible, includePositions, basketId]);

  const handleClose = () => {
    setAnalyticsData(null);
    setError(null);
    onClose();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Spin size="large" />
          <div className="mt-4 text-lg text-zyon-blue">
            Loading...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <ExclamationCircleOutlined className="text-price-red text-4xl mb-4" />
          <div className="mt-4 text-lg text-price-red text-center">
            Error while Loading Analytics. <p/> Please Try Again!
          </div>
        </div>
      );
    }

    if (analyticsData) {
      return (
        <div className="w-full">
          <OptionsAnalyticsWidget
            analyticsData={analyticsData}
            isPopup={true}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ maxWidth: '1400px' }}
      destroyOnHidden
      title={null}
      closable={false}
      classNames={{ content: "!p-0 !bg-neutral-800 !opacity-100", mask: "!bg-neutral-300/50" }}
    >
      {/* Custom Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-neutral-900 rounded-t-lg font-family-roboto">
        <h2 className="text-base font-semibold text-neutral-400 p-0 m-0">Risk & Reward Analysis</h2>
        <button
          onClick={handleClose}
          className="text-gray-300 hover:text-gray-400 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="px-3 bg-neutral-800 rounded-b-lg">
        {renderContent()}
      </div>
    </Modal>
  );
};

export default OptionsAnalyticsPopup; 