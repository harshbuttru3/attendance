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
) ENGINE=InnoDB AUTO_INCREMENT=1595 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1152,131,'Ethical Hacking','3',30,2,'Cybersecurity'),(1153,138,'Ethical Hacking','3',30,25,'Cybersecurity'),(1154,141,'Ethical Hacking','3',30,0,'Cybersecurity'),(1155,136,'Ethical Hacking','3',30,27,'Cybersecurity'),(1156,139,'Ethical Hacking','3',30,0,'Cybersecurity'),(1157,132,'Ethical Hacking','3',30,2,'Cybersecurity'),(1158,137,'Ethical Hacking','3',30,26,'Cybersecurity'),(1159,142,'Ethical Hacking','3',30,0,'Cybersecurity'),(1160,135,'Ethical Hacking','3',30,28,'Cybersecurity'),(1161,134,'Ethical Hacking','3',30,29,'Cybersecurity'),(1162,133,'Ethical Hacking','3',30,2,'Cybersecurity'),(1163,140,'Ethical Hacking','3',30,0,'Cybersecurity'),(1164,143,'Ethical Hacking','3',30,0,'Cybersecurity'),(1165,144,'Ethical Hacking','3',30,0,'Cybersecurity'),(1166,145,'Ethical Hacking','3',30,0,'Cybersecurity'),(1167,146,'Ethical Hacking','3',30,0,'Cybersecurity'),(1168,147,'Ethical Hacking','3',30,0,'Cybersecurity'),(1169,148,'Ethical Hacking','3',30,0,'Cybersecurity'),(1170,149,'Ethical Hacking','3',30,0,'Cybersecurity'),(1171,150,'Ethical Hacking','3',30,0,'Cybersecurity'),(1172,151,'Ethical Hacking','3',30,0,'Cybersecurity'),(1173,152,'Ethical Hacking','3',30,0,'Cybersecurity'),(1174,153,'Ethical Hacking','3',30,0,'Cybersecurity'),(1175,154,'Ethical Hacking','3',30,0,'Cybersecurity'),(1176,155,'Ethical Hacking','3',30,0,'Cybersecurity'),(1177,156,'Ethical Hacking','3',30,0,'Cybersecurity'),(1178,157,'Ethical Hacking','3',30,0,'Cybersecurity'),(1179,158,'Ethical Hacking','3',30,0,'Cybersecurity'),(1180,159,'Ethical Hacking','3',30,0,'Cybersecurity'),(1181,160,'Ethical Hacking','3',30,31,'Cybersecurity'),(1182,161,'Ethical Hacking','3',30,0,'Cybersecurity'),(1183,162,'Ethical Hacking','3',30,0,'Cybersecurity'),(1184,163,'Ethical Hacking','3',30,0,'Cybersecurity'),(1185,164,'Ethical Hacking','3',30,0,'Cybersecurity'),(1186,165,'Ethical Hacking','3',30,0,'Cybersecurity'),(1187,166,'Ethical Hacking','3',30,0,'Cybersecurity'),(1188,167,'Ethical Hacking','3',30,0,'Cybersecurity'),(1189,168,'Ethical Hacking','3',30,0,'Cybersecurity'),(1190,169,'Ethical Hacking','3',30,0,'Cybersecurity'),(1191,170,'Ethical Hacking','3',30,0,'Cybersecurity'),(1192,171,'Ethical Hacking','3',30,0,'Cybersecurity'),(1193,172,'Ethical Hacking','3',30,0,'Cybersecurity'),(1194,173,'Ethical Hacking','3',30,0,'Cybersecurity'),(1195,174,'Ethical Hacking','3',30,0,'Cybersecurity'),(1196,175,'Ethical Hacking','3',30,0,'Cybersecurity'),(1197,176,'Ethical Hacking','3',30,0,'Cybersecurity'),(1198,177,'Ethical Hacking','3',30,0,'Cybersecurity'),(1199,178,'Ethical Hacking','3',30,0,'Cybersecurity'),(1200,179,'Ethical Hacking','3',30,0,'Cybersecurity'),(1201,180,'Ethical Hacking','3',30,0,'Cybersecurity'),(1202,181,'Ethical Hacking','3',30,0,'Cybersecurity'),(1203,182,'Ethical Hacking','3',30,0,'Cybersecurity'),(1204,183,'Ethical Hacking','3',30,0,'Cybersecurity'),(1205,184,'Ethical Hacking','3',30,0,'Cybersecurity'),(1206,185,'Ethical Hacking','3',30,0,'Cybersecurity'),(1207,186,'Ethical Hacking','3',30,32,'Cybersecurity'),(1208,187,'Ethical Hacking','3',30,0,'Cybersecurity'),(1209,188,'Ethical Hacking','3',30,0,'Cybersecurity'),(1210,189,'Ethical Hacking','3',30,0,'Cybersecurity'),(1211,190,'Ethical Hacking','3',30,0,'Cybersecurity'),(1212,191,'Ethical Hacking','3',30,0,'Cybersecurity'),(1213,192,'Ethical Hacking','3',30,0,'Cybersecurity'),(1214,193,'Ethical Hacking','3',30,0,'Cybersecurity'),(1341,132,'Web Application Security','3',30,29,'Cybersecurity'),(1342,133,'Web Application Security','3',30,28,'Cybersecurity'),(1343,131,'Web Application Security','3',30,30,'Cybersecurity'),(1344,134,'Web Application Security','3',30,27,'Cybersecurity'),(1345,135,'Web Application Security','3',30,26,'Cybersecurity'),(1346,136,'Web Application Security','3',30,25,'Cybersecurity'),(1347,137,'Web Application Security','3',30,24,'Cybersecurity'),(1348,138,'Web Application Security','3',30,23,'Cybersecurity'),(1349,139,'Web Application Security','3',30,22,'Cybersecurity'),(1350,140,'Web Application Security','3',30,21,'Cybersecurity'),(1351,141,'Web Application Security','3',30,0,'Cybersecurity'),(1352,142,'Web Application Security','3',30,0,'Cybersecurity'),(1353,143,'Web Application Security','3',30,0,'Cybersecurity'),(1354,144,'Web Application Security','3',30,0,'Cybersecurity'),(1355,145,'Web Application Security','3',30,0,'Cybersecurity'),(1356,146,'Web Application Security','3',30,0,'Cybersecurity'),(1357,147,'Web Application Security','3',30,0,'Cybersecurity'),(1358,148,'Web Application Security','3',30,0,'Cybersecurity'),(1359,149,'Web Application Security','3',30,0,'Cybersecurity'),(1360,150,'Web Application Security','3',30,0,'Cybersecurity'),(1361,151,'Web Application Security','3',30,0,'Cybersecurity'),(1362,152,'Web Application Security','3',30,0,'Cybersecurity'),(1363,153,'Web Application Security','3',30,0,'Cybersecurity'),(1364,154,'Web Application Security','3',30,0,'Cybersecurity'),(1365,155,'Web Application Security','3',30,0,'Cybersecurity'),(1366,156,'Web Application Security','3',30,0,'Cybersecurity'),(1367,157,'Web Application Security','3',30,0,'Cybersecurity'),(1368,158,'Web Application Security','3',30,0,'Cybersecurity'),(1369,159,'Web Application Security','3',30,0,'Cybersecurity'),(1370,160,'Web Application Security','3',30,0,'Cybersecurity'),(1371,161,'Web Application Security','3',30,0,'Cybersecurity'),(1372,162,'Web Application Security','3',30,0,'Cybersecurity'),(1373,163,'Web Application Security','3',30,0,'Cybersecurity'),(1374,164,'Web Application Security','3',30,0,'Cybersecurity'),(1375,165,'Web Application Security','3',30,0,'Cybersecurity'),(1376,166,'Web Application Security','3',30,0,'Cybersecurity'),(1377,167,'Web Application Security','3',30,0,'Cybersecurity'),(1378,168,'Web Application Security','3',30,0,'Cybersecurity'),(1379,169,'Web Application Security','3',30,0,'Cybersecurity'),(1380,170,'Web Application Security','3',30,0,'Cybersecurity'),(1381,171,'Web Application Security','3',30,0,'Cybersecurity'),(1382,172,'Web Application Security','3',30,0,'Cybersecurity'),(1383,173,'Web Application Security','3',30,0,'Cybersecurity'),(1384,174,'Web Application Security','3',30,0,'Cybersecurity'),(1385,175,'Web Application Security','3',30,0,'Cybersecurity'),(1386,176,'Web Application Security','3',30,0,'Cybersecurity'),(1387,177,'Web Application Security','3',30,0,'Cybersecurity'),(1388,178,'Web Application Security','3',30,0,'Cybersecurity'),(1389,179,'Web Application Security','3',30,0,'Cybersecurity'),(1390,180,'Web Application Security','3',30,0,'Cybersecurity'),(1391,181,'Web Application Security','3',30,0,'Cybersecurity'),(1392,182,'Web Application Security','3',30,0,'Cybersecurity'),(1393,183,'Web Application Security','3',30,0,'Cybersecurity'),(1394,184,'Web Application Security','3',30,0,'Cybersecurity'),(1395,185,'Web Application Security','3',30,0,'Cybersecurity'),(1396,186,'Web Application Security','3',30,0,'Cybersecurity'),(1397,187,'Web Application Security','3',30,0,'Cybersecurity'),(1398,188,'Web Application Security','3',30,0,'Cybersecurity'),(1399,189,'Web Application Security','3',30,0,'Cybersecurity'),(1400,190,'Web Application Security','3',30,0,'Cybersecurity'),(1401,191,'Web Application Security','3',30,0,'Cybersecurity'),(1402,192,'Web Application Security','3',30,0,'Cybersecurity'),(1403,193,'Web Application Security','3',30,0,'Cybersecurity');
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

-- Dump completed on 2025-03-13  0:31:45
