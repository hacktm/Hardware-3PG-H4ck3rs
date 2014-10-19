/*
The sketch accepts a Bluetooth Low Energy 4 connection from an
iPhone and accepts commands from the iPhone to run upto 4
standard servos.

This sketch is suppose to work with the rfduinoServo application.

It receives two bytes from the iPhone.  The first byte contains
the servos to set (bit1 = servo a, bit2 = servo b, etc), and
the value is the number of degrees (0-180) to position the servo
too.
*/

/*
 Copyright (c) 2014 OpenSourceRF.com.  All right reserved.

 This library is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this library; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//#include <Servo.h>
#include <RFduinoBLE.h>

//Servo s1;
//Servo s2;
//Servo s3;
//Servo s4;

void setup() {
  /*
  s1.attach(2);
  s2.attach(3);
  s3.attach(4);
  s4.attach(5);
 */
  Serial.begin(9600);
  Serial.println("Initialization");
  
  

    for(int i=2;i<7;i++)
    {
        pinMode(i, OUTPUT);
    }
  
  
  RFduinoBLE.advertisementInterval = 675;
  RFduinoBLE.advertisementData = "-servo";
  RFduinoBLE.deviceName = "RFduino1";
  RFduinoBLE.begin();
}
void senddata(char *buffer, int n)
{
   // char hello[] = {'h', 'e', 'l', 'l', 'o'};
    RFduinoBLE.send(buffer, n);
    Serial.println("senddata");
}
void all_high()
{
    for(int i=2;i<7;i++)
    {
      digitalWrite(i, LOW);
    }
}
void all_low()
{
  for(int i=2;i<7;i++)
  {
    digitalWrite(i, HIGH);
  }
}
void loop() {
    
    digitalWrite(2, HIGH);
    digitalWrite(3, LOW);
    delay(1000);
    
    digitalWrite(2, LOW);
    digitalWrite(3, HIGH);
    delay(1000);
     
  //digitalWrite(3, HIGH);
  // RFduino_ULPDelay(INFINITE);
}

void RFduinoBLE_onReceive(char *data, int len){
  Serial.println("receive");
  char msg[32];
  sprintf(msg, "%c %c\n", data[0], data[1]);
  Serial.print(msg);
  int servo = data[0];
  int degree = data[1];
  senddata(data, len);
   /* 
  if (bitRead(servo, 1))
    s1.write(degree);
  if (bitRead(servo, 2))
    s2.write(degree);
  if (bitRead(servo, 3))
    s3.write(degree);
  if (bitRead(servo, 4))
    s4.write(degree);
*/
}
