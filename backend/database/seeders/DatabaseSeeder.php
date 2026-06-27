<?php

namespace Database\Seeders;

use App\Models\ElderlyProfile;
use App\Models\FamilyConnection;
use App\Models\HealthRecord;
use App\Models\Medicine;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Caregiver
        $caregiver = User::create([
            'name'     => 'Dr. Priya Sharma',
            'email'    => 'caregiver@sunaulo.app',
            'password' => Hash::make('password'),
            'role'     => 'caregiver',
        ]);

        // Family member
        $family = User::create([
            'name'     => 'Aarti Rai',
            'email'    => 'family@sunaulo.app',
            'password' => Hash::make('password'),
            'role'     => 'family',
        ]);

        // Elderly user
        $elderlyUser = User::create([
            'name'     => 'Ram Bahadur Thapa',
            'email'    => 'elderly@sunaulo.app',
            'password' => Hash::make('password'),
            'role'     => 'elderly',
        ]);

        // Elderly profile
        $profile = ElderlyProfile::create([
            'user_id'            => $elderlyUser->id,
            'age'                => 72,
            'gender'             => 'male',
            'blood_group'        => 'B+',
            'medical_conditions' => ['Hypertension', 'Type 2 Diabetes'],
            'caregiver_id'       => $caregiver->id,
        ]);

        // Family connection
        FamilyConnection::create([
            'family_user_id' => $family->id,
            'elderly_id'     => $profile->id,
        ]);

        // Sample health records
        foreach (range(7, 0) as $daysAgo) {
            HealthRecord::create([
                'elderly_id'               => $profile->id,
                'blood_pressure_systolic'  => rand(115, 130),
                'blood_pressure_diastolic' => rand(75, 88),
                'sugar_level'              => rand(90, 110),
                'weight'                   => 68.5,
                'temperature'              => 36.8,
                'oxygen_level'             => rand(96, 99),
                'pulse_rate'               => rand(68, 78),
                'water_intake'             => round(rand(14, 20) / 10, 1),
                'sleep_hours'              => round(rand(55, 80) / 10, 1),
                'recorded_by'              => $caregiver->id,
                'created_at'               => now()->subDays($daysAgo),
                'updated_at'               => now()->subDays($daysAgo),
            ]);
        }

        // Sample medicines
        $med1 = Medicine::create([
            'elderly_id'    => $profile->id,
            'medicine_name' => 'Metformin',
            'dosage'        => '500mg',
            'frequency'     => 'Twice daily',
            'reminder_time' => ['08:00', '20:00'],
            'instructions'  => 'Take with meals.',
            'active'        => true,
        ]);

        Medicine::create([
            'elderly_id'    => $profile->id,
            'medicine_name' => 'Lisinopril',
            'dosage'        => '10mg',
            'frequency'     => 'Once daily',
            'reminder_time' => ['09:00'],
            'instructions'  => 'Take in the morning.',
            'active'        => true,
        ]);

        Medicine::create([
            'elderly_id'    => $profile->id,
            'medicine_name' => 'Atorvastatin',
            'dosage'        => '20mg',
            'frequency'     => 'Once daily',
            'reminder_time' => ['21:00'],
            'instructions'  => 'Take at night.',
            'active'        => true,
        ]);

        // Sample notifications for family & caregiver
        Notification::create([
            'receiver_id' => $family->id,
            'title'       => 'Medicine Taken ✓',
            'message'     => 'Ram Bahadur has taken Metformin.',
            'type'        => 'medicine_taken',
            'read'        => false,
        ]);

        Notification::create([
            'receiver_id' => $caregiver->id,
            'title'       => 'Health Update',
            'message'     => 'New health record added for Ram Bahadur Thapa.',
            'type'        => 'health_record',
            'read'        => false,
        ]);

        $this->command->info('✅ Sunaulo demo data seeded!');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Caregiver', 'caregiver@sunaulo.app', 'password'],
                ['Family',    'family@sunaulo.app',    'password'],
                ['Elderly',   'elderly@sunaulo.app',   'password'],
            ]
        );
    }
}
