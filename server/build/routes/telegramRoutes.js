"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const telegramController_1 = require("../controllers/telegramController");
const router = (0, express_1.Router)();
router.post('/simulate', telegramController_1.simulateUserMessage);
exports.default = router;
