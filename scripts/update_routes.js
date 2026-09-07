import fs from 'fs';
import path from 'path';

const backend = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';
const apiRoutesPath = path.join(backend, 'routes', 'api.php');
let routes = fs.readFileSync(apiRoutesPath, 'utf8');

const target = "Route::post('applications/{id}/approve', [\\App\\Http\\Controllers\\Api\\Admin\\AdminInternshipController::class, 'approveApplication']);";
const replacement = "Route::post('applications/{id}/appointment-details', [\\App\\Http\\Controllers\\Api\\Admin\\AdminInternshipController::class, 'saveAppointmentDetails']);\n              Route::post('applications/{id}/approve', [\\App\\Http\\Controllers\\Api\\Admin\\AdminInternshipController::class, 'approveApplication']);";

if (!routes.includes("applications/{id}/appointment-details")) {
  routes = routes.replace(target, replacement);
  fs.writeFileSync(apiRoutesPath, routes);
  console.log('Registered appointment-details route in api.php');
} else {
  console.log('appointment-details route already registered');
}
