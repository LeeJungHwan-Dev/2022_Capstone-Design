package com.a201812163.ips_2auth;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

public class login_Acvitiy extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_acvitiy);

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                loadID();
            }
        }, 1500);
    }

    protected void loadID() {

        SharedPreferences preferences = getSharedPreferences("pref", Activity.MODE_PRIVATE);

        if (preferences != null && preferences.contains("id")) {
            Intent intent = new Intent(this,MainActivity.class);
            startActivity(intent);
            finish();
        } else {
            Intent intent = new Intent(this,login_Check_Acitivity.class);
            startActivity(intent);
            finish();
        }
    }
}