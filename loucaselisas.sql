-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: loucaselisas
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `AdminPermissions`
--

LOCK TABLES `AdminPermissions` WRITE;
/*!40000 ALTER TABLE `AdminPermissions` DISABLE KEYS */;
INSERT INTO `AdminPermissions` (`id`, `panelAdm`, `panelCreator`, `createChats`, `deleteComments`, `panelStatistics`, `updateUsers`, `deleteUsers`) VALUES ('9b08bb17036',0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `AdminPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` (`id`, `cover`, `name`) VALUES ('29383f7d8f36','','Categoria 1'),('29383f7d8f37','','Categoria 2'),('29383f7d8f38','','Categoria 3'),('29383f7d8f39','','Categoria 4');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Chat`
--

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ContractLogs`
--

LOCK TABLES `ContractLogs` WRITE;
/*!40000 ALTER TABLE `ContractLogs` DISABLE KEYS */;
INSERT INTO `ContractLogs` (`id`, `start_date`, `end_date`, `paid`, `user_id`, `plan_id`) VALUES (1,'1713078377490','1744614377490',0,'bb17036e7b8',1),(2,'1713078380955','1744614380955',199.99,'bb17036e7b8',2),(3,'1713078383305','1744614383305',0,'bb17036e7b8',1);
/*!40000 ALTER TABLE `ContractLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Creator`
--

LOCK TABLES `Creator` WRITE;
/*!40000 ALTER TABLE `Creator` DISABLE KEYS */;
INSERT INTO `Creator` (`id`, `user_id`, `active`, `description`, `language`, `nickname`) VALUES ('76eb859f989','bb17036e7b8',1,'conteúdos educativos com tutoriais relacionados a extremismo islâmico e terrorismo','arabe','alfredo cursos');
/*!40000 ALTER TABLE `Creator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Gallery`
--

LOCK TABLES `Gallery` WRITE;
/*!40000 ALTER TABLE `Gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `Gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `GeneralPermissions`
--

LOCK TABLES `GeneralPermissions` WRITE;
/*!40000 ALTER TABLE `GeneralPermissions` DISABLE KEYS */;
INSERT INTO `GeneralPermissions` (`id`, `editProfile`, `deleteProfile`) VALUES ('b08bb17036e',0,0);
/*!40000 ALTER TABLE `GeneralPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Image`
--

LOCK TABLES `Image` WRITE;
/*!40000 ALTER TABLE `Image` DISABLE KEYS */;
/*!40000 ALTER TABLE `Image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Lesson`
--

LOCK TABLES `Lesson` WRITE;
/*!40000 ALTER TABLE `Lesson` DISABLE KEYS */;
/*!40000 ALTER TABLE `Lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Paymentcard`
--

LOCK TABLES `Paymentcard` WRITE;
/*!40000 ALTER TABLE `Paymentcard` DISABLE KEYS */;
INSERT INTO `Paymentcard` (`id`, `number`, `owner`, `validity`, `cvc`, `type`, `user_id`, `bank`, `flag`) VALUES (1,'5502095079113306','Fernando Burgos','02/31','367','CREDIT','bb17036e7b8','Nu Pagamentos Sa','mastercard'),(3,'2306500954860832','Fernando Burgos','11/29','941','CREDIT','bb17036e7b8','Banco Inter S.A.','mastercard'),(6,'5233900894986784','Seila Sei La','10/24','596','DEBIT','bb17036e7b8',NULL,NULL);
/*!40000 ALTER TABLE `Paymentcard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Plan`
--

LOCK TABLES `Plan` WRITE;
/*!40000 ALTER TABLE `Plan` DISABLE KEYS */;
INSERT INTO `Plan` (`id`, `name`, `price`, `duration`, `description`) VALUES (1,'Plano Gratuito',0,'31536000000',''),(2,'Plano Premium',199.99,'31536000000','');
/*!40000 ALTER TABLE `Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `PlanContract`
--

LOCK TABLES `PlanContract` WRITE;
/*!40000 ALTER TABLE `PlanContract` DISABLE KEYS */;
INSERT INTO `PlanContract` (`id`, `start_date`, `end_date`, `paid`, `plan_id`, `user_id`) VALUES (3,'1713078383305','1744614383305',0,1,'bb17036e7b8');
/*!40000 ALTER TABLE `PlanContract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ProfilePermissions`
--

LOCK TABLES `ProfilePermissions` WRITE;
/*!40000 ALTER TABLE `ProfilePermissions` DISABLE KEYS */;
INSERT INTO `ProfilePermissions` (`id`, `viewMembers`, `privacyProfile`, `viewPrivacyProfile`, `indexProfile`) VALUES ('08bb17036e7',0,0,0,0);
/*!40000 ALTER TABLE `ProfilePermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` (`id`, `admin_permissions_id`, `general_permissions_id`, `name`, `profile_permissions_id`) VALUES (1,'9b08bb17036','b08bb17036e','padrão','08bb17036e7');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
INSERT INTO `Student` (`id`, `user_id`) VALUES ('8bb17036e7b','bb17036e7b8');
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` (`id`, `username`, `email`, `password`, `name`, `cpf`, `birth`, `phone`, `pronoun`, `image`, `google_id`, `google_token`, `admin`, `bio`, `cover`, `uf`, `role_id`, `instagram`, `profession`, `tiktok`) VALUES ('bb17036e7b8','burgos','fernando@agenciaboz.com.br','Fernando1','Fernando Burgos','02576698506','902113200000','41984556795','him','http://192.168.18.5:4112/static/users/bb17036e7b8/f2197f00-e070-43d4-a57b-ac26c6d99eea.png',NULL,NULL,0,'Poucos ingredientes são necessários para preparar esta massa gulosa que vai agradar os jovens e adultos. Estas receitas simples são dedicadas a quem tem pouco tempo para cozinhar.\n\nVocê vai precisar de: uma colher de margarina, molho, colorau e óleo. Juntando todos esses ingredientes em uma panela, o almoço fica garantido.','http://192.168.18.5:4112/static/users/bb17036e7b8/d38d99bb-ebda-4c06-a7e0-c4f34832bd1a.png','PR',1,'nandoburgos','Desenvolvedor','');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Video`
--

LOCK TABLES `Video` WRITE;
/*!40000 ALTER TABLE `Video` DISABLE KEYS */;
/*!40000 ALTER TABLE `Video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_CategoryToCourse`
--

LOCK TABLES `_CategoryToCourse` WRITE;
/*!40000 ALTER TABLE `_CategoryToCourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `_CategoryToCourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_CategoryToCreator`
--

LOCK TABLES `_CategoryToCreator` WRITE;
/*!40000 ALTER TABLE `_CategoryToCreator` DISABLE KEYS */;
/*!40000 ALTER TABLE `_CategoryToCreator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_CourseToCreator`
--

LOCK TABLES `_CourseToCreator` WRITE;
/*!40000 ALTER TABLE `_CourseToCreator` DISABLE KEYS */;
/*!40000 ALTER TABLE `_CourseToCreator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_CourseToStudent`
--

LOCK TABLES `_CourseToStudent` WRITE;
/*!40000 ALTER TABLE `_CourseToStudent` DISABLE KEYS */;
/*!40000 ALTER TABLE `_CourseToStudent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_favorite_courses`
--

LOCK TABLES `_favorite_courses` WRITE;
/*!40000 ALTER TABLE `_favorite_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `_favorite_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_favorite_creators`
--

LOCK TABLES `_favorite_creators` WRITE;
/*!40000 ALTER TABLE `_favorite_creators` DISABLE KEYS */;
/*!40000 ALTER TABLE `_favorite_creators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES ('1fbec342-5a0b-4c71-a596-847796db09bb','b2031e53c2ac5393471e279d580b7629a5003b95123df9c0584c6f4749667117','2024-04-15 02:40:50.052','20240415024050_course_price',NULL,NULL,'2024-04-15 02:40:50.031',1),('2c35c5f5-8b6c-4b67-bb3d-06b16953f929','9a7a73d4aeed410dad4642c0244735db5e57c7f8c14453f4490c8d52af4611e0','2024-04-14 07:01:50.009','20240414035023_plan_history',NULL,NULL,'2024-04-14 07:01:49.914',1),('2ff5f0c9-d090-4fa7-ace3-412cbb4b29b7','d7262cef61300867bd919e0debebb55ded54062fb44feeadafe3d51e5edd0835','2024-04-14 07:01:49.504','20240320150958_chat',NULL,NULL,'2024-04-14 07:01:49.351',1),('33154e30-baca-4f3f-a7ff-679c124cd3a7','ce1433f7321f14d0d900dfbaa74359bd38498c9f24442c383b13f1d91a0520d4','2024-04-14 07:01:48.545','20240214184508_update',NULL,NULL,'2024-04-14 07:01:48.534',1),('33c1a840-92dc-4ce2-9467-210f6123debf','a42d41fc113e712a2217ffd4a4dfe4e10b8060fd7667a9a60b2907fce54e5e42','2024-04-14 07:01:48.533','20240214182825_update',NULL,NULL,'2024-04-14 07:01:48.207',1),('400e2691-d774-4585-ada2-83dba2aac4be','5984403633068f5e5ba7913db4307abbe0867d89b5f46c50dfc6b0de7d2d5af4','2024-04-14 07:01:48.205','20240214153344_init',NULL,NULL,'2024-04-14 07:01:48.148',1),('54b045fa-3b2f-43f1-932e-fa8917e02f92','9ff41ce66a152412ccfec939023386da41521c6157607fc0ae5a5c073304d784','2024-04-14 07:01:48.909','20240312160812_roles',NULL,NULL,'2024-04-14 07:01:48.773',1),('5aa51e43-878e-49e5-bc63-d64acdb7cb01','6398269a86c2ac8760e3af637f858507e6645720a531f80cefeebda66dea5ab8','2024-04-14 07:01:49.549','20240320165502_course',NULL,NULL,'2024-04-14 07:01:49.506',1),('6bc8a7c2-f2ea-49a2-8b78-45f13a24c1b8','d51e796474189ee15728405edfb97bf598a2d3687d42f022ab86676ea85dfad3','2024-04-14 07:01:49.913','20240414034338_plan_history',NULL,NULL,'2024-04-14 07:01:49.871',1),('6d2170b5-7dea-40f4-8e91-d2f319c62400','ef08b637f7a997e3e25c9b21b44fecb5f43fa563ac22e79a4bd782b0a1d395ca','2024-04-14 07:01:49.622','20240320182304_lessons',NULL,NULL,'2024-04-14 07:01:49.550',1),('7113346c-3762-4daf-89f3-e38f0b0912cb','e87a5103c2507d42d92375e2b51b037e4923ce6e803df47b62a505785842971e','2024-04-14 07:01:49.869','20240414025234_plan_contract',NULL,NULL,'2024-04-14 07:01:49.749',1),('75376f65-c5ae-413e-99d7-0ec7e772745e','b6c68f1bd3c9e54e3d25e9a903dcb714aee5a70333206bb7f547350ce2066b72','2024-04-14 07:01:49.673','20240327195805_course_fix_user_relationship',NULL,NULL,'2024-04-14 07:01:49.624',1),('7a1b08ca-6019-4792-806a-011720136dc4','19ee9369e23f83d479ed92b1d32494267d900dc191bfe084908a5dad8082a8d1','2024-04-14 07:01:48.586','20240216143717_paymentcard',NULL,NULL,'2024-04-14 07:01:48.547',1),('9347e251-9a4c-445d-9b0e-91f9d2ecf58f','8dc2956b4374741ace9b90c926580b0319fcdb2b2928d67d3d9aec6caee42850','2024-04-14 07:01:54.331','20240414070154_card_id_type',NULL,NULL,'2024-04-14 07:01:54.287',1),('9590610f-fd09-40f3-a5f3-157b2ca787cf','4187372ec0acf294fc64200adec936eea241e0a8db94581f92e9afa4da24429b','2024-04-14 07:01:50.040','20240414052249_card_type_enum',NULL,NULL,'2024-04-14 07:01:50.011',1),('a552e656-b52f-4988-930a-cf82754d7fa3','05b3379f1097c6a9d79a18077c98f6ffd694ef03c18a241ac39ae1c7b42ed005','2024-04-14 07:01:49.747','20240414015903_plan',NULL,NULL,'2024-04-14 07:01:49.675',1),('ad671b33-3205-4031-8249-67da284bb75a','8cd52cbfdc1d860cbde217e5957534da29d463ea3971958db246679453844110','2024-04-14 07:01:48.707','20240306183723_user_student',NULL,NULL,'2024-04-14 07:01:48.605',1),('c2e28b75-956e-4741-a4df-320fb8df7fa9','0fb600e7eecce8e4c40ead683bee596aa4f47daaeb4545274801069438294984','2024-04-14 07:01:48.770','20240312160657_roles',NULL,NULL,'2024-04-14 07:01:48.709',1),('c40e1fd8-927e-4d3c-aa2f-8d8050fec199','ea5c25feeb76888a336b76720e18900c8809bb61b3bc829f15300bffba1375ad','2024-04-14 07:01:48.603','20240306174927_user_creator_id',NULL,NULL,'2024-04-14 07:01:48.587',1),('dac721bd-6727-442a-9e4d-a83b7015f344','396b0edcd3717fb8c9864405c7112713bde33e7cf19124bdb48e3f28d4f3e880','2024-04-14 07:01:49.349','20240318125411_fix_wrong_logic',NULL,NULL,'2024-04-14 07:01:49.329',1),('ecba32a1-44fe-442e-931c-c5d62e5249a0','aebda22cbcef890c012ed7c6ee34e6cc64dd4f9ade58d5b086b7c97be19b31aa','2024-04-14 07:01:49.328','20240315170848_schema',NULL,NULL,'2024-04-14 07:01:48.911',1),('f082b303-324b-452e-8d03-986a44778c40','3a8b08391f8979a8caf24ca4b1f1335865efe5b34ef7a2fa5c707a8142e63660','2024-04-14 07:01:50.054','20240414061210_card_bank',NULL,NULL,'2024-04-14 07:01:50.041',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-15  0:11:32
