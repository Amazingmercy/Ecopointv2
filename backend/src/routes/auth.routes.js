const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadLogo');
const validate = require('../middlewares/validate');
const { registerSchoolSchema, loginSchema,  registerCollectorSchema, registerMemberSchema, resetPasswordSchema, forgotPasswordSchema} = require('../utils/joiValidators');

const {
  registerSchool,
  loginSchool,
  registerMember,
  loginMember,
  registerCollector,
  loginCollector,
  forgetPassword,
  resetPassword
} = require('../controllers/auth.controller');

// SCHOOL
router.post('/school/register', upload.single('logo'), validate(registerSchoolSchema), registerSchool);
router.post('/school/login', validate(loginSchema), loginSchool);

// MEMBER
router.post('/member/register', validate(registerMemberSchema), registerMember);
router.post('/member/login', validate(loginSchema), loginMember);

// COLLECTOR
router.post('/collector/register', validate(registerCollectorSchema), registerCollector);
router.post('/collector/login', validate(loginSchema), loginCollector);

// PASSWORD RESET
router.post('/auth/forgot-password', validate(forgotPasswordSchema), forgetPassword);
router.post('/auth/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
