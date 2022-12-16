package com.a201812163.ips_2auth;

import static java.util.Base64.getEncoder;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import android.view.View;
import android.widget.Button;
import android.widget.EditText;


import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


public class login_Check_Acitivity extends AppCompatActivity {

    Button go_auth;
    EditText id,pw;

    FirebaseFirestore db = FirebaseFirestore.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_check_acitivity);


        go_auth = findViewById(R.id.check_login_btn);
        id = findViewById(R.id.id_input);
        pw = findViewById(R.id.pw_input);


        go_auth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(id.getText().toString().equals("") || pw.getText().toString().equals("")){
                    Snackbar.make(view,"아이디와 비밀번호를 입력해주세요.",Snackbar.LENGTH_SHORT).show();
                }else {
                    check(view);
                }
            }
        });

    }

    public void check(View view){
        DocumentReference docRef = db.collection("User_List").document(id.getText().toString());
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        if(getSha512(pw.getText().toString()).equals(document.getData().get("pw").toString())){
                            Snackbar.make(view,"로그인 성공", Snackbar.LENGTH_LONG).show();
                            saveID(id.getText().toString());
                            Intent intent = new Intent(getApplicationContext(),MainActivity.class);
                            startActivity(intent);
                            finish();
                        }else{
                            Snackbar.make(view,"비밀번호를 확인해주세요.", Snackbar.LENGTH_LONG).show();
                        }
                    } else {
                        Snackbar.make(view,"아이디가 존재하지 않습니다.",Snackbar.LENGTH_SHORT).show();
                    }
                } else {
                    Snackbar.make(view, "다시 시도해주세요.", Snackbar.LENGTH_SHORT).show();
                }
            }
        });
    }

    private String getSha512(String value) {
        //암호화 완료된 값 보관할 변수
        String encPwd=null;
        //알고리즘 불러오기 위한 객체
        MessageDigest md = null;
        try {
            md=MessageDigest.getInstance("SHA-512");
        }catch(NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        //알고리즘을 이용해서 byte단위로 암호화 처리
        byte[] bytes=value.getBytes(Charset.forName("UTF-8"));
        //MessageDigest 객체에 있는 update 메소드를 활용해서 byte값을 단방향 암호화 처리 함
        md.update(bytes);
        //byte단위로 암호화한 내용을 String 값으로 변환해서 encPwd에 넣어줌.
        encPwd=getEncoder().encodeToString(md.digest());
        //encPwd 반환
        return encPwd;
    }

    private void saveID(String id){
        SharedPreferences preferences = getSharedPreferences("pref", Activity.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString("id",id);
        editor.commit();
    }


}