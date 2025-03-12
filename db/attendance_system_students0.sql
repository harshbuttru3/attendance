CREATE DATABASE  IF NOT EXISTS `attendance_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `attendance_system`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: attendance_system
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_no` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `branch` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_no` (`registration_no`)
) ENGINE=InnoDB AUTO_INCREMENT=453 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (59,'22105111002','Vipin Ram','3rd','CSE'),(60,'22105111003','Utkarsh Kumar','3rd','CSE'),(61,'22105111024','Avinash Kumar Singh','3rd','CSE'),(62,'22105111032','Sweta Kumari','3rd','CSE'),(63,'22105111040','Sadashiv Kashyap','3rd','CSE'),(64,'23105111001','Purushottam Kumar Singh','3rd','CSE'),(65,'23105111002','Prachi Kumari','3rd','CSE'),(66,'23105111003','Manish Kumar','3rd','CSE'),(67,'23105111004','Ashish Kumar Kamat','3rd','CSE'),(68,'23105111005','Pawan Kumar Malakar','3rd','CSE'),(69,'23105111006','Deepali Kumari','3rd','CSE'),(70,'23105111007','Mehrun Nisha','3rd','CSE'),(71,'23105111008','Komal Kumari','3rd','CSE'),(72,'23105111009','Neha Kumari','3rd','CSE'),(73,'23105111010','Ajay Pradhan','3rd','CSE'),(74,'23105111011','Sumit Raj','3rd','CSE'),(75,'23105111012','Shobha Kumari','3rd','CSE'),(76,'23105111013','Anjali Kumari','3rd','CSE'),(77,'23105111014','Anjali Kumari','3rd','CSE'),(78,'23105111015','Mainuddin Ansari','3rd','CSE'),(79,'23105111016','Sweety Kumari','3rd','CSE'),(80,'23105111017','Sakshi Kumari','3rd','CSE'),(81,'23105111018','Abhishek Raj','3rd','CSE'),(82,'23105111019','Shreya Suman','3rd','CSE'),(83,'23105111020','Shreya Shandil','3rd','CSE'),(84,'23105111021','Md Rehan Akbar','3rd','CSE'),(85,'23105111022','Jagriti Kumari Lucky','3rd','CSE'),(86,'23105111023','Reetik Kumar','3rd','CSE'),(87,'23105111024','Nabil Shamim','3rd','CSE'),(88,'23105111025','Prince Kumar','3rd','CSE'),(89,'23105111026','Amrit Kumar Savan','3rd','CSE'),(90,'23105111027','Omrita Kumari','3rd','CSE'),(91,'23105111028','Aradhya','3rd','CSE'),(92,'23105111029','Puja Rani','3rd','CSE'),(93,'23105111030','Ashutosh Kumar','3rd','CSE'),(94,'23105111031','Ankit Kumar','3rd','CSE'),(95,'23105111032','Laxman Kumar','3rd','CSE'),(96,'23105111033','Mukul Prakash','3rd','CSE'),(97,'23105111034','Satya Prakash','3rd','CSE'),(98,'23105111035','Aman Kumar','3rd','CSE'),(99,'23105111036','Chandani Kumari','3rd','CSE'),(100,'23105111037','Prashant Kumar','3rd','CSE'),(101,'23105111038','Sudhanshu Kumar','3rd','CSE'),(102,'23105111039','Ankit Kumar','3rd','CSE'),(103,'23105111040','Indrajeet Kumar','3rd','CSE'),(104,'23105111041','Manisha Kumari','3rd','CSE'),(105,'23105111042','Sonam Kumari','3rd','CSE'),(106,'23105111043','Rohit Kumar','3rd','CSE'),(107,'23105111044','Suryesh Kumar','3rd','CSE'),(108,'23105111045','Rahul Kumar','3rd','CSE'),(109,'23105111046','Naman','3rd','CSE'),(110,'23105111047','Pushplata','3rd','CSE'),(111,'23105111048','Kumari Mansi','3rd','CSE'),(112,'23105111049','Intekhab Alam','3rd','CSE'),(113,'23105111050','Saanvi','3rd','CSE'),(114,'23105111051','Ankit Raj','3rd','CSE'),(115,'23105111052','Abhishek Kumar','3rd','CSE'),(116,'23105111053','Suharsh Bharti','3rd','CSE'),(117,'23105111054','Vijay Kumar','3rd','CSE'),(118,'23105111055','Vivek Kumar','3rd','CSE'),(119,'23105111056','Yuvraj Kumar','3rd','CSE'),(120,'23105111057','Harsh Raj','3rd','CSE'),(121,'24105111901','Tripti Kiran','3rd','CSE'),(122,'24105111902','Nisha Kumari','3rd','CSE'),(123,'24105111903','Vidya Kumari','3rd','CSE'),(124,'24105111905','Sanya Sinha','3rd','CSE'),(125,'24105111906','Neha Kumari','3rd','CSE'),(126,'24105111907','Prakash Ranjan Kumar','3rd','CSE'),(127,'24105111908','Adarsh Kumar','3rd','CSE'),(128,'24105111909','Aditi Kumari','3rd','CSE'),(129,'24105111910','Himesh Dayal','3rd','CSE'),(130,'24105111911','Shintu Kumar','3rd','CSE'),(131,'23152111001','Varsha Sinha','3rd','Cybersecurity'),(132,'23152111002','Ayush Kumar','3rd','Cybersecurity'),(133,'23152111003','Akash Kumar Ray','3rd','Cybersecurity'),(134,'23152111004','Arun Kumar','3rd','Cybersecurity'),(135,'23152111005','Hari Om','3rd','Cybersecurity'),(136,'23152111006','Amarjeet Kumar','3rd','Cybersecurity'),(137,'23152111007','Ranjan Kumar','3rd','Cybersecurity'),(138,'23152111008','Shikha Shree','3rd','Cybersecurity'),(139,'23152111009','Guddu Kumar Yadav','3rd','Cybersecurity'),(140,'23152111010','Fahmida Parween','3rd','Cybersecurity'),(141,'23152111011','Satwik Shrivastava','3rd','Cybersecurity'),(142,'23152111012','Anish Kumar','3rd','Cybersecurity'),(143,'23152111013','Shikha Kumari','3rd','Cybersecurity'),(144,'23152111014','Zaid Amir','3rd','Cybersecurity'),(145,'23152111015','Bhumika','3rd','Cybersecurity'),(146,'23152111016','Mohd Murad Alam','3rd','Cybersecurity'),(147,'23152111017','Sweta Kumari','3rd','Cybersecurity'),(148,'23152111018','Siddharthkumarjha','3rd','Cybersecurity'),(149,'23152111019','Abhishek Kumar','3rd','Cybersecurity'),(150,'23152111020','Chulbul Kumari','3rd','Cybersecurity'),(151,'23152111021','Manisha Kumari','3rd','Cybersecurity'),(152,'23152111022','Khushi Kumari','3rd','Cybersecurity'),(153,'23152111023','Amarjeet Kumar','3rd','Cybersecurity'),(154,'23152111024','Priyanshu Malini','3rd','Cybersecurity'),(155,'23152111025','Shivam Raj','3rd','Cybersecurity'),(156,'23152111026','Raunak Kumari','3rd','Cybersecurity'),(157,'23152111027','Aashi Kumari','3rd','Cybersecurity'),(158,'23152111028','Sakshi Kishan','3rd','Cybersecurity'),(159,'23152111029','Anand Mankar','3rd','Cybersecurity'),(160,'23152111030','Shivam Kumar','3rd','Cybersecurity'),(161,'23152111031','Ayush Kumar','3rd','Cybersecurity'),(162,'23152111032','Khushi Kumari','3rd','Cybersecurity'),(163,'23152111033','Soni Priya','3rd','Cybersecurity'),(164,'23152111034','Sidrat','3rd','Cybersecurity'),(165,'23152111035','Anamika Kumari','3rd','Cybersecurity'),(166,'23152111036','Ayush Ranjan','3rd','Cybersecurity'),(167,'23152111037','Aryan Raj','3rd','Cybersecurity'),(168,'23152111038','Swarn Abha','3rd','Cybersecurity'),(169,'23152111039','Vikku Kumar','3rd','Cybersecurity'),(170,'23152111040','Sanjeet Kumar Singh','3rd','Cybersecurity'),(171,'23152111041','Divya Kumari','3rd','Cybersecurity'),(172,'23152111042','Aman Kumar','3rd','Cybersecurity'),(173,'23152111044','Chandan Kumar','3rd','Cybersecurity'),(174,'23152111045','Nilu Kumari','3rd','Cybersecurity'),(175,'23152111046','Swaraj Kumar Ray','3rd','Cybersecurity'),(176,'23152111047','Ashutosh Kumar','3rd','Cybersecurity'),(177,'23152111048','Ashwini Kumari','3rd','Cybersecurity'),(178,'23152111049','Ravi Kumar','3rd','Cybersecurity'),(179,'23152111051','Kumari Archana Sinha','3rd','Cybersecurity'),(180,'23152111052','Ankit Kumar','3rd','Cybersecurity'),(181,'23152111053','Avinash Kumar','3rd','Cybersecurity'),(182,'23152111054','Alok Kumar','3rd','Cybersecurity'),(183,'23152111055','Sonu Kumar','3rd','Cybersecurity'),(184,'23152111056','Sujeet Das','3rd','Cybersecurity'),(185,'23152111057','Rajan Dev Singh','3rd','Cybersecurity'),(186,'23152111058','Anshuman','3rd','Cybersecurity'),(187,'23152111059','Ankit Aman','3rd','Cybersecurity'),(188,'24152111901','Simran Sinha','3rd','Cybersecurity'),(189,'24152111903','Aangan Nirala','3rd','Cybersecurity'),(190,'24152111904','Nitish Kumar','3rd','Cybersecurity'),(191,'24152111905','Birendra Kumar Sahu','3rd','Cybersecurity'),(192,'24152111906','Gaurav Kumar','3rd','Cybersecurity'),(193,'24152111908','Komal Raj','3rd','Cybersecurity');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-13  0:31:44
