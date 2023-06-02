import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import feather from 'feather-icons';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChartComponent = () => {
  const chartRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const collectionRef = collection(
      db,
      'todos',
      'f3adC8WShePwSBwjQ2yj',
      'basic_users',
      'm831SaFD4oCioO6nfTc7',
      'products'
    );

    
    const getProduct = async () => {
      try {
        const productSnapshot = await getDocs(collectionRef);
        const productData = productSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setProducts(productData);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, []);

  useEffect(() => {
    feather.replace({ 'aria-hidden': 'true', 'width': '50', 'height': '50' });

    const ctx = document.getElementById('myChart');

    // Destroy the previous Chart instance, if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Prepare the data for the chart
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    const quantitiesByDay = [0, 0, 0, 0, 0, 0, 0]; // Initialize quantities for each day of the week

    // Filter products based on selected date
    const filteredProducts = selectedDate
      ? products.filter((product) => {
          const updatedTime = product.updatedtime.toDate();
          return updatedTime.toDateString() === selectedDate.toDateString();
        })
      : products;

    // Update quantities based on filtered product data
    filteredProducts.forEach((product) => {
      const updatedTime = product.updatedtime.toDate();
      const dayIndex = updatedTime.getDay();
      const productQuantity = product.productQuantity;
      quantitiesByDay[dayIndex] += productQuantity;
    });

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [{
          data: quantitiesByDay,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }, [products, selectedDate]);

  const handleShare = () => {
    const canvas = document.getElementById('myChart');
    const imageURL = canvas.toDataURL('image/png');
    // Replace the share implementation with your preferred method (e.g., sharing via social media library)
    console.log('Sharing the chart:', imageURL);
  };

  const handleExport = () => {
    const canvas = document.getElementById('myChart');
    const imageURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'chart.png';
    link.click();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-start pt-3 pb-2 mb-3 border-bottom m-10">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleShare}>
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleExport}>
              Export
            </button>
            <span data-feather="calendar" className="calendar-icon"></span>
            <DatePicker
            selected={selectedDate}
            type='number'
            onChange={handleDateChange}
            className="btn btn-sm m-2 btn-outline-secondary"
            dateFormat="MMMM d, yyyy"
            peekNextMonth
            showMonthDropdown
            placeholderText='mm-dd-yyyy'
            showYearDropdown
            dropdownMode="select"
          >
            
          </DatePicker>
            {/* <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle"> */}
          </div>
        </div>
      </div>
      <canvas className="my-4 w-100 m-3" id="myChart" width="500" height="150"></canvas>
    </div>
  );
};

export default ChartComponent;
