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
-- Table structure for table `teacher_subjects`
--

DROP TABLE IF EXISTS `teacher_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `semester` varchar(50) DEFAULT NULL,
  `branch` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `teacher_subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subjects`
--

LOCK TABLES `teacher_subjects` WRITE;
/*!40000 ALTER TABLE `teacher_subjects` DISABLE KEYS */;
INSERT INTO `teacher_subjects` VALUES (75,1,'Physics','3rd','Cybersecurity'),(76,1,'Physics','3rd','CSE'),(77,1,'Physics','3rd','EEE'),(78,1,'Physics','2nd','Cybersecurity'),(79,1,'Physics','2nd','CSE'),(80,1,'Physics','2nd','EEE'),(81,1,'Physics','1st','Cybersecurity'),(82,1,'Physics','1st','CSE'),(83,1,'Physics','1st','EEE'),(84,1,'OOPS-L','3rd','Cybersecurity'),(85,1,'OOPS-L','3rd','CSE'),(86,1,'OOPS-L','3rd','EEE'),(87,1,'OOPS-L','2nd','Cybersecurity'),(88,1,'OOPS-L','2nd','CSE'),(89,1,'OOPS-L','2nd','EEE'),(90,1,'OOPS-L','1st','Cybersecurity'),(91,1,'OOPS-L','1st','CSE'),(92,1,'OOPS-L','1st','EEE'),(93,1,'OOPS','3rd','Cybersecurity'),(94,1,'OOPS','3rd','CSE'),(95,1,'OOPS','3rd','EEE'),(96,1,'OOPS','2nd','Cybersecurity'),(97,1,'OOPS','2nd','CSE'),(98,1,'OOPS','2nd','EEE'),(99,1,'OOPS','1st','Cybersecurity'),(100,1,'OOPS','1st','CSE'),(101,1,'OOPS','1st','EEE'),(102,2,'Mathematics','1st','Cybersecurity'),(103,6,'Mathematics','7th','EEE'),(104,6,'Mathematics','7th','FTS'),(105,6,'Mathematics','8th','EEE'),(106,6,'Mathematics','8th','FTS'),(107,6,'Mathematics','1st','EEE'),(108,6,'Mathematics','1st','FTS'),(109,6,'Physics','7th','EEE'),(110,6,'Physics','7th','FTS'),(111,6,'Physics','8th','EEE'),(112,6,'Physics','8th','FTS'),(113,6,'Physics','1st','EEE'),(114,6,'Physics','1st','FTS'),(115,6,'Physics-L','7th','EEE'),(116,6,'Physics-L','7th','FTS'),(117,6,'Physics-L','8th','EEE'),(118,6,'Physics-L','8th','FTS'),(119,6,'Physics-L','1st','EEE'),(120,6,'Physics-L','1st','FTS'),(121,7,'Mathematics','1st','CSE'),(122,8,'Physics','3rd','CSE'),(123,8,'Physics','3rd','Cybersecurity'),(124,8,'Physics','2nd','CSE'),(125,8,'Physics','2nd','Cybersecurity'),(126,8,'AE','3rd','CSE'),(127,8,'AE','3rd','Cybersecurity'),(128,8,'AE','2nd','CSE'),(129,8,'AE','2nd','Cybersecurity'),(130,9,'Physics','3rd','CSE'),(131,9,'Physics','3rd','Cybersecurity'),(132,9,'Physics','2nd','CSE'),(133,9,'Physics','2nd','Cybersecurity'),(134,9,'AE','3rd','CSE'),(135,9,'AE','3rd','Cybersecurity'),(136,9,'AE','2nd','CSE'),(137,9,'AE','2nd','Cybersecurity');
/*!40000 ALTER TABLE `teacher_subjects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-23 19:56:34
