require('dotenv').config();
const app = require('./app');
const { seedAdmin } = require('./controllers/adminController');
const { generateSubscriptionCode } = require('./services/codeService');

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  await seedAdmin();
  if (process.env.NODE_ENV !== 'production') {
    const demoPro = generateSubscriptionCode('PRO', 60);
    const demoBasic = generateSubscriptionCode('BASIC', 30);
    console.log('Demo PRO code:', demoPro.code);
    console.log('Demo BASIC code:', demoBasic.code);
    console.log('Admin login: admin@storehub.local / admin123');
  }

  app.listen(PORT, () => {
    console.log(`StoreHub API running on http://localhost:${PORT}`);
  });
}

bootstrap();
