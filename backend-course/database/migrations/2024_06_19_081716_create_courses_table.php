<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropForeign(['course_id']); // Adjust the foreign key name as necessary
        });

        Schema::dropIfExists('courses');

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('courseId')->unique();
            $table->string('imageUrl');
            $table->LongText('description')->nullable();
            $table->date('startDate');
            $table->date('endDate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
