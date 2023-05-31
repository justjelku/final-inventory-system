import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import feather from 'feather-icons';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ChartComponent = () => {
  const chartRef = useRef(null);
  const [products, setProducts] = useState([]);
  const collectionRef = collection(
    db,
    'todos',
    'f3adC8WShePwSBwjQ2yj',
    'basic_users',
    'm831SaFD4oCioO6nfTc7',
    'products'
  );

  useEffect(() => {
    const getProduct = async () => {
      await getDocs(collectionRef)
        .then((product) => {
          let productData = product.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setProducts(productData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getProduct();
  }, []);

  useEffect(() => {
    feather.replace({ 'aria-hidden': 'true' });

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

    // Update quantities based on product data
    products.forEach((product) => {
      const updatedtime = product.updatedtime.toDate(); // Assuming updatedTime field is of type Firestore Timestamp
      const dayIndex = updatedtime.getDay(); // Get the day index (0 = Sunday, 1 = Monday, etc.)
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
  }, [products]); // Update the chart when the products data changes

  return (
    <canvas className="my-4 w-100 m-3" id="myChart" width="500" height="150"></canvas>
  );
};

export default ChartComponent;
