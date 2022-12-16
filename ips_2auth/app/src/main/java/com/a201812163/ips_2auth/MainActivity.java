package com.a201812163.ips_2auth;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;


import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.SetOptions;
import com.google.firebase.messaging.FirebaseMessaging;

import org.checkerframework.checker.units.qual.A;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    Button LoginButton;
    TextView textView;
    ImageView img1,img2;
    int status = 0;
    FirebaseFirestore db = FirebaseFirestore.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LoginButton = findViewById(R.id.login_btn);
        textView = findViewById(R.id.textView);
        img1 = findViewById(R.id.imageView1);
        img2 = findViewById(R.id.imageView2);

        power_opt();

        LoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(status == 1){
                    sendAuth();
                    status = 0;
                }else{
                    img1.setVisibility(View.VISIBLE);
                    img2.setVisibility(View.GONE);
                    textView.setText("요청받은 인증이 없습니다.");
                    Snackbar.make(view,"요청받은 인증이 없습니다.",Snackbar.LENGTH_SHORT).show();
                }
            }
        });

        Auth auth = new Auth();
        auth.start();



    }

    private String getID(){
        SharedPreferences preferences = getSharedPreferences("pref", Activity.MODE_PRIVATE);

        if(preferences != null ){
            if(preferences.contains("id")){
                String name = preferences.getString("id","null");
                return name;
            }
        }
        return "";
    }

    @Override
    protected void onStop() {
        super.onStop();

        Map<String, Object> data = new HashMap<>();
        data.put("authRequest", "0");

        db.collection("User_List").document(getID())
                .set(data, SetOptions.merge());
    }

    public void check(){

        final DocumentReference docRef = db.collection("User_List").document(getID());
        docRef.addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot snapshot,
                                @Nullable FirebaseFirestoreException e) {
                if (snapshot != null && snapshot.exists()) {
                    try {
                        String auth_status = snapshot.getData().get("authRequest").toString();
                        if (auth_status.equals("1")) {
                            img1.setVisibility(View.GONE);
                            img2.setVisibility(View.VISIBLE);
                            textView.setText("2차 인증을 진행해주세요.");
                            LoginButton.setText("승인");
                            status = 1;
                        }else if(auth_status.equals("ok")){
                            img1.setVisibility(View.VISIBLE);
                            img2.setVisibility(View.GONE);
                            textView.setText("감사합니다. \n\n 웹 사이트로 돌아가 확인을 눌러주세요.");
                            LoginButton.setText("확인");
                            status = 0;
                        }
                    } catch (Exception ex) {}

                }
            }
        });
    }

    public void sendAuth(){

        Map<String, Object> data = new HashMap<>();
        data.put("authRequest", "ok");

        db.collection("User_List").document(getID())
                .set(data, SetOptions.merge());
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "우리집 지키미 알림 서비스";
            String description = "우리집 지키미 알림 서비스 설정";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel("우리집 지키미", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void power_opt(){
        PowerManager pm= (PowerManager) getSystemService(Context.POWER_SERVICE);
        String packageName= getPackageName();
        if (pm.isIgnoringBatteryOptimizations(packageName) ){

        } else {    // 메모리 최적화가 되어 있다면, 풀기 위해 설정 화면 띄움.
            Intent intent=new Intent();
            intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + packageName));
            startActivity(intent);
        }

    }

    class Auth extends Thread{
        @Override
        public void run() {
            super.run();

            createNotificationChannel();
            check();
            FirebaseMessaging.getInstance().getToken()
                    .addOnCompleteListener(new OnCompleteListener<String>() {
                        @Override
                        public void onComplete(@NonNull Task<String> task) {
                            if (!task.isSuccessful()) {
                                return;
                            }

                            Map<String, Object> data = new HashMap<>();
                            data.put("authID", task.getResult());

                            db.collection("User_List").document(getID())
                                    .set(data, SetOptions.merge());

                        }
                    });

        }
    }



}