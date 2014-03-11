/**
 * Requirements - Responsible for declaring all of the system types and modules 
 * needed to construct the system API object.
 * @copyright PencilBlue, all rights reserved.
 */
//setup global resources & modules
global.url        = require('url');
global.fs         = require('fs');
global.http       = require('http');
global.path       = require('path');
global.formidable = require('formidable');
global.process    = require('process');
global.minify     = require('minify');
global.winston    = require('winston');
global.async      = require('async');
global.crypto     = require('crypto');
global.util       = require('util');
global.locale     = require('locale');

var promise       = require('node-promise');
global.when       = promise.when;
global.Promise    = promise.Promise;
global.Cookies    = require('cookies');

//hack for fs module
fs.exists     = fs.exists     || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

//define what will become the global entry point into the server api.
global.pb = {};

//load the configuration
pb.config = require('./config');

//configure logging
global.log = 
pb.log     = require(DOCUMENT_ROOT+'/include/utils/logging.js').logger(winston, pb.config);

//configure cache
pb.cache = require(DOCUMENT_ROOT+'/include/dao/cache.js').createClient(pb.config);

//configure the DB manager
pb.dbm = new (require(DOCUMENT_ROOT+'/include/dao/db_manager').DBManager);

//setup system class types
pb.DAO = require(DOCUMENT_ROOT+'/include/dao/dao');

//setup DBObject Service
pb.dbobject = new (require(DOCUMENT_ROOT+'/include/model/db_object').DBObjectService);	

//setup the session handler
pb.SessionHandler = require(DOCUMENT_ROOT+'/include/session/session.js');
pb.session        = new pb.SessionHandler();

//setup utils
pb.utils = require(DOCUMENT_ROOT+'/include/util.js');

//setup object services
pb.SimpleLayeredService = require(DOCUMENT_ROOT+'/include/service/simple_layered_service.js').SimpleLayeredService;
pb.MemoryEntityService  = require(DOCUMENT_ROOT+'/include/service/memory_entity_service.js').MemoryEntityService;
pb.CacheEntityService   = require(DOCUMENT_ROOT+'/include/service/cache_entity_service.js').CacheEntityService;
pb.DBEntityService      = require(DOCUMENT_ROOT+'/include/service/db_entity_service.js').DBEntityService;
pb.FSEntityService      = require(DOCUMENT_ROOT+'/include/service/fs_entity_service.js').FSEntityService;

//setup settings service
pb.SettingServiceFactory = require(DOCUMENT_ROOT+'/include/system/settings.js').SettingServiceFactory;
pb.settings              = pb.SettingServiceFactory.getService(pb.config.settings.use_memory, pb.config.settings.use_cache);

//setup template service
pb.TemplateServiceFactory = require(DOCUMENT_ROOT+'/include/templates.js').TemplateServiceFactory;
pb.templates              = pb.TemplateServiceFactory.getService(pb.config.templates.use_memory, pb.config.templates.use_cache);

//setup security
pb.security = require(DOCUMENT_ROOT+'/include/access_management.js').SecurityService;

//setup user service
pb.UserService = require(DOCUMENT_ROOT+'/include/service/entities/user_service.js').UserService;
pb.users = new pb.UserService();

//setup request handling
pb.BaseController   = require(DOCUMENT_ROOT+'/controllers/base_controller.js').BaseController;
pb.FormController   = require(DOCUMENT_ROOT+'/controllers/form_controller.js').FormController;
pb.DeleteController = require(DOCUMENT_ROOT+'/controllers/delete_controller.js').DeleteController;
pb.RequestHandler   = require(DOCUMENT_ROOT+'/include/http/request_handler.js').RequestHandler;
pb.RequestHandler.init();

//setup errors
global.PBError = require(DOCUMENT_ROOT+'/include/error/pb_error.js');

//setup localization
pb.Localization = require(DOCUMENT_ROOT+'/include/localization.js').Localization;
pb.Localization.init();

//Email settings and functions
pb.EmailService = require(DOCUMENT_ROOT+'/include/email').EmailService;
pb.email        = new pb.EmailService();

//system requires
pb.DocumentCreator = require(DOCUMENT_ROOT+'/include/model/create_document.js').DocumentCreator;	// Document creation
pb.content         = require(DOCUMENT_ROOT+'/include/content').ContentService;			        	// Content settings and functions			        
pb.js              = require(DOCUMENT_ROOT+'/include/client_js').ClientJS;							// Client JS
pb.AdminNavigation = require(DOCUMENT_ROOT+'/include/admin_navigation').AdminNavigation;			// Admin Navigation

//Export system object
module.exports = pb;
