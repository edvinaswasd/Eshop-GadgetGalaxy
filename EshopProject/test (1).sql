-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 03, 2023 at 07:42 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartlist`
--

CREATE TABLE `cartlist` (
  `productId` varchar(64) NOT NULL,
  `productName` varchar(64) NOT NULL,
  `productPrice` varchar(64) NOT NULL,
  `productCategory` varchar(64) NOT NULL,
  `quantity` int(64) NOT NULL,
  `userEmail` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartlist`
--

INSERT INTO `cartlist` (`productId`, `productName`, `productPrice`, `productCategory`, `quantity`, `userEmail`, `description`) VALUES
('1', 'iPhone', '999.99', 'Phone', 1, 'ind@gmail.com', 'A high-end smartphone'),
('32', 'Smart scale', '99.99', 'Health', 6, 'ind@gmail.com', 'A scale that measures your weight and other metrics'),
('36', 'Smartwatch for kids', '99.99', 'Accessories', 1, 'ind@gmail.com', 'A smartwatch designed for kids'),
('48', 'Wi-Fi Router', '129.99', 'Internet', 5, 'ind@gmail.com', 'This router provides fast and reliable internet to all your devices'),
('57', 'Smart Door Lock', '199.99', 'Security', 6, 'ind@gmail.com', 'This smart lock allows you to lock and unlock your door from anywhere using your smartphone'),
('7', 'Apple Watch', '399.99', 'Accessories', 5, 'ind@gmail.com', 'A smartwatch with many features');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` varchar(64) DEFAULT NULL,
  `description` varchar(152) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `category`) VALUES
(2, 'MacBook', '1499.9', 'A powerful laptop', 'Computer'),
(3, 'iPad', '499.99', 'A tablet computer', 'Tablet'),
(4, 'Smart TV', '899.99', 'A high-quality television', 'TV'),
(5, 'Kindle', '199.99', 'A portable e-reader', 'Electronic'),
(6, 'PlayStation ', '499.99', 'A popular gaming console', 'Games'),
(7, 'Apple Watch', '399.99', 'A smartwatch with many features', 'Accessories'),
(8, 'Noise-cancelling headphones', '299.99', 'Wireless headphones with great sound', 'Accessories'),
(9, 'Drone', '799.99', 'A remote-controlled flying device', 'Electronics'),
(15, 'Smart thermostat', '199.99', 'A device to control your home\'s temperature', 'Home'),
(16, 'External hard drive', '179.99', 'A device to store and backup your files', 'Storage'),
(17, 'Webcam', '79.99', 'A device to capture video for video calls', 'Accessories'),
(18, 'Wireless mouse', '49.99', 'A device to control your computer', 'Accessories'),
(19, 'Wireless keyboard', '69.99', 'A device to input text into your computer', 'Accessories'),
(20, 'Portable monitor', '199.99', 'A lightweight monitor', 'Computer'),
(21, 'Gaming mouse', '79.99', 'A mouse designed for gaming', 'Games'),
(22, 'Gaming keyboard', '99.99', 'A keyboard designed for gaming', 'Games'),
(23, 'Smart security camera', '149.99', 'A camera to monitor your home', 'Security'),
(24, 'Action camera', '299.99', 'A camera for outdoor activities', 'Electronics'),
(25, 'Wireless earbuds', '129.99', 'Earbuds with wireless connectivity', 'Accessories'),
(26, 'Robot vacuum cleaner', '399.99', 'A robotic device to clean your floors', 'Home'),
(27, 'Smart light bulb', '39.99', 'A bulb that can be controlled with your phone', 'Home'),
(28, 'Smart lock', '299.99', 'A device to lock and unlock your door', 'Security'),
(29, 'Projector', '399.99', 'A device to project images and videos', 'Electronics'),
(30, 'Portable charger', '49.99', 'A device to charge your devices on the go', 'Accessories'),
(31, 'Wireless charging pad', '29.99', 'A device to wirelessly charge your phone', 'Accessories'),
(32, 'Smart scale', '99.99', 'A scale that measures your weight and other metrics', 'Health'),
(33, 'Smart water bottle', '49.99', 'A water bottle that tracks your water intake', 'Health'),
(34, 'Virtual reality headset', '299.99', 'A headset for virtual reality experiences', 'Games'),
(35, 'Electric toothbrush', '149.99', 'A toothbrush with electric bristles', 'Health'),
(36, 'Smartwatch for kids', '99.99', 'A smartwatch designed for kids', 'Accessories'),
(37, 'Portable air purifier', '99.99', 'A device to purify the air around you', 'Home'),
(38, 'Smart meat thermometer', '149.99', 'A thermometer for cooking meat', 'Home'),
(39, 'Smart rice cooker', '199.99', 'A device to cook rice', 'Home'),
(40, 'Smart blender', '249.99', 'A blender with smart features', 'Home'),
(41, 'Smart treadmill', '999.99', 'A treadmill with smart features', 'Health'),
(42, 'Wireless Earbuds', '49.99', 'These earbuds are perfect for listening to music or taking calls without any wires getting in your way.', 'Phone'),
(43, 'Smartwatch', '199.99', 'This smartwatch tracks your fitness', 'Accessories'),
(44, 'Laptop', '899.99', 'This laptop features a powerful processor', 'Computer'),
(45, 'Gaming Mouse', '79.99', 'This gaming mouse has a high-precision sensor and customizable buttons', 'Accessories'),
(46, 'Smart Home Hub', '149.99', 'This device connects to all your smart home devices and allows you to control them with your voice or a mobile app.', 'Accessories'),
(47, 'Fitness Tracker', '69.99', 'This fitness tracker monitors your steps', 'Health'),
(48, 'Wi-Fi Router', '129.99', 'This router provides fast and reliable internet to all your devices', 'Internet'),
(49, 'Smartphone', '799.99', 'This smartphone has a large', 'Phone'),
(50, 'Security Camera', '99.99', 'This camera provides high-quality video surveillance for your home or office', 'Security'),
(51, 'External Hard Drive', '129.99', 'This hard drive provides extra storage space for your computer', 'Storage'),
(52, 'Tablet', '399.99', 'This tablet has a large', 'Tablet'),
(53, 'Smart TV', '999.99', 'This TV features a large', 'TV'),
(54, 'Bluetooth Speaker', '79.99', 'This speaker delivers high-quality sound and connects to your devices via Bluetooth for wireless listening.', 'Accessories'),
(55, 'Desktop Computer', '1299.9', 'This desktop computer has a powerful processor', 'Computer'),
(56, 'Gaming Keyboard', '99.99', 'This gaming keyboard features customizable RGB lighting and programmable keys for a personalized gaming experience.', 'Accessories'),
(57, 'Smart Door Lock', '199.99', 'This smart lock allows you to lock and unlock your door from anywhere using your smartphone', 'Security'),
(58, 'Wireless Charging Pad', '29.99', 'This charging pad lets you charge your phone or other devices wirelessly', 'Accessories'),
(59, 'Portable Projector', '299.99', 'This projector allows you to project movies', 'Electronics'),
(60, 'Wireless Router', '99.99', 'This router provides fast and reliable Wi-Fi to all your devices', 'Internet'),
(61, 'Bluetooth Headphones', '99.99', 'These headphones deliver high-quality sound and connect to your devices via Bluetooth for wireless listening.', 'Accessories'),
(62, 'Smart Thermostat', '249.99', 'This thermostat learns your temperature preferences and automatically adjusts the temperature in your home for optimal comfort and energy savings.', 'Home'),
(63, 'Smart Plug', '24.99', 'This plug allows you to control any electrical device in your home', 'Home'),
(64, 'Wireless Keyboard and Mouse Combo', '59.99', 'This combo includes a wireless keyboard and mouse with long battery life and reliable connectivity.', 'Accessories'),
(65, 'Smart Doorbell', '149.99', 'This doorbell provides high-quality video and audio', 'Security'),
(66, 'Bluetooth Car Kit', '39.99', 'This car kit connects to your phone via Bluetooth and allows you to make hands-free calls and stream music through your car\'s speakers.', 'Accessories'),
(67, 'Portable Charger', '49.99', 'This charger lets you charge your phone or other devices on the go', 'Accessories'),
(68, 'Wireless Gaming Controller', '79.99', 'This gaming controller connects wirelessly to your console or PC', 'Games'),
(69, 'Smart Light Bulbs', '49.99', 'These bulbs connect to your Wi-Fi network and can be controlled with your voice or a mobile app', 'Home'),
(70, 'Wireless Mouse', '29.99', 'This mouse has a long battery life and connects to your computer via a wireless receiver', 'Computer'),
(71, 'Smart Smoke Detector', '99.99', 'This smoke detector detects smoke and carbon monoxide and alerts your phone in case of an emergency', 'Security'),
(72, 'Wireless Headphones', '129.99', 'These headphones deliver high-quality sound and connect to your devices via Bluetooth for wireless listening', 'Accessories'),
(73, 'Virtual Reality Headset', '299.99', 'This headset allows you to immerse yourself in virtual reality games', 'Games'),
(74, 'Smart Water Bottle', '59.99', 'This water bottle tracks your water intake and reminds you to drink more water throughout the day', 'Health'),
(75, 'Wireless Charging Stand', '39.99', 'This charging stand lets you charge your phone or other devices wirelessly', 'Accessories'),
(76, 'Smart Lock Box', '129.99', 'This lock box provides secure storage for keys', 'Home'),
(77, 'Wireless Presenter', '49.99', 'This presenter allows you to control your presentations from a distance', 'Computer'),
(78, 'Smart Scale', '79.99', 'This scale tracks your weight', 'Accessories'),
(79, 'Wireless Gaming Headset', '149.99', 'This gaming headset delivers high-quality sound and connects wirelessly to your console or PC', 'Games'),
(80, 'Smart Outlet', '29.99', 'This outlet allows you to control any electrical device in your home with your voice or a mobile app', 'Home'),
(81, 'Wireless Keyboard', '39.99', 'This keyboard has a long battery life and connects to your computer via a wireless receiver', 'Computer'),
(82, 'Smart Air Purifier', '199.99', 'This air purifier detects air quality and automatically adjusts its fan speed and filters to provide clean air', 'Home'),
(83, 'Wireless Surround Sound', '299.99', 'This surround sound system delivers high-quality audio and connects wirelessly to your TV or other devices', 'TV'),
(84, 'Smart Thermostat', '199.99', 'This thermostat learns your schedule and preferences and adjusts the temperature of your home accordingly', 'Home'),
(85, 'Wireless Webcam', '79.99', 'This webcam connects wirelessly to your computer or other devices', 'Computer'),
(86, 'Smart Bike Lock', '79.99', 'This bike lock provides secure and convenient storage for your bike', 'Accessories'),
(87, 'Wireless Bluetooth Speaker', '99.99', 'This speaker delivers high-quality sound and connects wirelessly to your phone or other devices', 'Accessories'),
(88, 'Smart Plant Sensor', '49.99', 'This sensor monitors the health of your plants and provides personalized care recommendations', 'Home'),
(89, 'Wireless Print Server', '59.99', 'This print server connects wirelessly to your printer and allows you to print from any device on your network', 'Computer'),
(90, 'Smart Kitchen Scale', '49.99', 'This kitchen scale measures ingredients and provides nutritional information', 'Home'),
(91, 'Wireless Touchpad', '29.99', 'This touchpad lets you control your computer or other devices with gestures and swipes', 'Computer'),
(92, 'Smart Door Lock', '199.99', 'This door lock provides keyless entry and secure access control', 'Security'),
(93, 'Wireless Presenter with Pointer', '59.99', 'This presenter allows you to control your presentations from a distance and includes a laser pointer and customizable buttons for enhanced productivity.', 'Accessories'),
(94, 'Smart Alarm Clock', '39.99', 'This alarm clock wakes you up gently with simulated sunrise and natural sounds', 'Home'),
(95, 'Wireless Barcode Scanner', '79.99', 'This barcode scanner connects wirelessly to your computer or other devices', 'Computer'),
(96, 'Smart Water Leak Detector', '49.99', 'This leak detector detects water leaks and alerts your phone in case of an emergency', 'Home'),
(97, 'Wireless Presenter with Touchpad', '69.99', 'This presenter allows you to control your presentations from a distance and includes a touchpad and customizable buttons for enhanced productivity.', 'Accessories'),
(98, 'Smart Pet Feeder', '159.99', 'This pet feeder dispenses food on a schedule and provides monitoring and control through a mobile app', 'Home'),
(100, 'Frock', '24.56', 'This is a cloath', 'Clothes');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`fname`, `lname`, `email`, `password`, `isAdmin`) VALUES
('insd`', 'sdfasd', 'sds@gmail.com', '$2b$10$i.txTS7hOLQIYYLWNiFYdOXx5JhJuZCA45nKLQphsWBlxywsGEevW', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartlist`
--
ALTER TABLE `cartlist`
  ADD PRIMARY KEY (`productId`,`userEmail`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
