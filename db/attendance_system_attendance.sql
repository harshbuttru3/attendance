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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `semester` varchar(50) DEFAULT NULL,
  `total_classes` int DEFAULT '0',
  `attended_classes` int DEFAULT '0',
  `branch` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`student_id`,`subject`,`semester`,`branch`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (393,131,'Physics','3rd',30,25,'Cybersecurity'),(394,141,'Physics','3rd',30,23,'Cybersecurity'),(395,142,'Physics','3rd',30,23,'Cybersecurity'),(396,133,'Physics','3rd',30,25,'Cybersecurity'),(397,139,'Physics','3rd',30,23,'Cybersecurity'),(398,134,'Physics','3rd',30,25,'Cybersecurity'),(399,137,'Physics','3rd',30,25,'Cybersecurity'),(400,140,'Physics','3rd',30,23,'Cybersecurity'),(401,132,'Physics','3rd',30,25,'Cybersecurity'),(402,135,'Physics','3rd',30,25,'Cybersecurity'),(403,143,'Physics','3rd',30,23,'Cybersecurity'),(404,136,'Physics','3rd',30,25,'Cybersecurity'),(405,138,'Physics','3rd',30,23,'Cybersecurity'),(406,144,'Physics','3rd',30,23,'Cybersecurity'),(407,145,'Physics','3rd',30,23,'Cybersecurity'),(408,146,'Physics','3rd',30,23,'Cybersecurity'),(409,147,'Physics','3rd',30,23,'Cybersecurity'),(410,148,'Physics','3rd',30,23,'Cybersecurity'),(411,149,'Physics','3rd',30,23,'Cybersecurity'),(412,150,'Physics','3rd',30,23,'Cybersecurity'),(413,151,'Physics','3rd',30,0,'Cybersecurity'),(414,152,'Physics','3rd',30,0,'Cybersecurity'),(415,153,'Physics','3rd',30,0,'Cybersecurity'),(416,154,'Physics','3rd',30,0,'Cybersecurity'),(417,155,'Physics','3rd',30,0,'Cybersecurity'),(418,156,'Physics','3rd',30,0,'Cybersecurity'),(419,157,'Physics','3rd',30,0,'Cybersecurity'),(420,158,'Physics','3rd',30,0,'Cybersecurity'),(421,159,'Physics','3rd',30,0,'Cybersecurity'),(422,161,'Physics','3rd',30,0,'Cybersecurity'),(423,162,'Physics','3rd',30,0,'Cybersecurity'),(424,163,'Physics','3rd',30,0,'Cybersecurity'),(425,164,'Physics','3rd',30,0,'Cybersecurity'),(426,165,'Physics','3rd',30,0,'Cybersecurity'),(427,166,'Physics','3rd',30,0,'Cybersecurity'),(428,167,'Physics','3rd',30,0,'Cybersecurity'),(429,168,'Physics','3rd',30,0,'Cybersecurity'),(430,169,'Physics','3rd',30,0,'Cybersecurity'),(431,170,'Physics','3rd',30,0,'Cybersecurity'),(432,171,'Physics','3rd',30,0,'Cybersecurity'),(433,172,'Physics','3rd',30,0,'Cybersecurity'),(434,173,'Physics','3rd',30,0,'Cybersecurity'),(435,174,'Physics','3rd',30,0,'Cybersecurity'),(436,175,'Physics','3rd',30,0,'Cybersecurity'),(437,176,'Physics','3rd',30,0,'Cybersecurity'),(438,177,'Physics','3rd',30,0,'Cybersecurity'),(439,178,'Physics','3rd',30,0,'Cybersecurity'),(440,179,'Physics','3rd',30,0,'Cybersecurity'),(441,180,'Physics','3rd',30,0,'Cybersecurity'),(442,181,'Physics','3rd',30,0,'Cybersecurity'),(443,182,'Physics','3rd',30,0,'Cybersecurity'),(444,183,'Physics','3rd',30,0,'Cybersecurity'),(445,184,'Physics','3rd',30,0,'Cybersecurity'),(446,185,'Physics','3rd',30,0,'Cybersecurity'),(447,186,'Physics','3rd',30,0,'Cybersecurity'),(448,187,'Physics','3rd',30,0,'Cybersecurity'),(449,188,'Physics','3rd',30,0,'Cybersecurity'),(450,189,'Physics','3rd',30,0,'Cybersecurity'),(451,190,'Physics','3rd',30,0,'Cybersecurity'),(452,191,'Physics','3rd',30,0,'Cybersecurity'),(453,192,'Physics','3rd',30,0,'Cybersecurity'),(454,193,'Physics','3rd',30,0,'Cybersecurity'),(455,132,'OOPS','3rd',30,21,'Cybersecurity'),(456,131,'OOPS','3rd',30,21,'Cybersecurity'),(457,133,'OOPS','3rd',30,12,'Cybersecurity'),(458,134,'OOPS','3rd',30,21,'Cybersecurity'),(459,135,'OOPS','3rd',30,21,'Cybersecurity'),(460,136,'OOPS','3rd',30,21,'Cybersecurity'),(461,137,'OOPS','3rd',30,21,'Cybersecurity'),(462,138,'OOPS','3rd',30,21,'Cybersecurity'),(463,139,'OOPS','3rd',30,0,'Cybersecurity'),(464,140,'OOPS','3rd',30,0,'Cybersecurity'),(465,141,'OOPS','3rd',30,0,'Cybersecurity'),(466,142,'OOPS','3rd',30,0,'Cybersecurity'),(467,143,'OOPS','3rd',30,0,'Cybersecurity'),(468,144,'OOPS','3rd',30,0,'Cybersecurity'),(469,145,'OOPS','3rd',30,0,'Cybersecurity'),(470,146,'OOPS','3rd',30,0,'Cybersecurity'),(471,147,'OOPS','3rd',30,0,'Cybersecurity'),(472,148,'OOPS','3rd',30,0,'Cybersecurity'),(473,149,'OOPS','3rd',30,0,'Cybersecurity'),(474,150,'OOPS','3rd',30,0,'Cybersecurity'),(475,151,'OOPS','3rd',30,0,'Cybersecurity'),(476,152,'OOPS','3rd',30,0,'Cybersecurity'),(477,153,'OOPS','3rd',30,0,'Cybersecurity'),(478,154,'OOPS','3rd',30,0,'Cybersecurity'),(479,155,'OOPS','3rd',30,0,'Cybersecurity'),(480,156,'OOPS','3rd',30,0,'Cybersecurity'),(481,157,'OOPS','3rd',30,0,'Cybersecurity'),(482,158,'OOPS','3rd',30,0,'Cybersecurity'),(483,159,'OOPS','3rd',30,0,'Cybersecurity'),(484,161,'OOPS','3rd',30,0,'Cybersecurity'),(485,162,'OOPS','3rd',30,0,'Cybersecurity'),(486,163,'OOPS','3rd',30,0,'Cybersecurity'),(487,164,'OOPS','3rd',30,0,'Cybersecurity'),(488,165,'OOPS','3rd',30,0,'Cybersecurity'),(489,166,'OOPS','3rd',30,0,'Cybersecurity'),(490,167,'OOPS','3rd',30,0,'Cybersecurity'),(491,168,'OOPS','3rd',30,0,'Cybersecurity'),(492,169,'OOPS','3rd',30,0,'Cybersecurity'),(493,170,'OOPS','3rd',30,0,'Cybersecurity'),(494,171,'OOPS','3rd',30,0,'Cybersecurity'),(495,172,'OOPS','3rd',30,0,'Cybersecurity'),(496,173,'OOPS','3rd',30,0,'Cybersecurity'),(497,174,'OOPS','3rd',30,0,'Cybersecurity'),(498,175,'OOPS','3rd',30,0,'Cybersecurity'),(499,176,'OOPS','3rd',30,0,'Cybersecurity'),(500,177,'OOPS','3rd',30,0,'Cybersecurity'),(501,178,'OOPS','3rd',30,0,'Cybersecurity'),(502,179,'OOPS','3rd',30,0,'Cybersecurity'),(503,180,'OOPS','3rd',30,0,'Cybersecurity'),(504,181,'OOPS','3rd',30,0,'Cybersecurity'),(505,182,'OOPS','3rd',30,0,'Cybersecurity'),(506,183,'OOPS','3rd',30,0,'Cybersecurity'),(507,184,'OOPS','3rd',30,0,'Cybersecurity'),(508,185,'OOPS','3rd',30,0,'Cybersecurity'),(509,186,'OOPS','3rd',30,0,'Cybersecurity'),(510,187,'OOPS','3rd',30,0,'Cybersecurity'),(511,188,'OOPS','3rd',30,0,'Cybersecurity'),(512,189,'OOPS','3rd',30,0,'Cybersecurity'),(513,190,'OOPS','3rd',30,0,'Cybersecurity'),(514,191,'OOPS','3rd',30,0,'Cybersecurity'),(515,192,'OOPS','3rd',30,0,'Cybersecurity'),(516,193,'OOPS','3rd',30,0,'Cybersecurity');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-23 19:56:33
