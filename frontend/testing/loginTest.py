from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time

class LoginTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)

    def test_login_and_out(self):
        driver = self.driver
        driver.get("http://localhost:4200/login")
        
        email = driver.find_element_by_id("email")
        email.send_keys("email@email.com")

        password = driver.find_element_by_id("password")
        password.send_keys("password")

        button = driver.find_element_by_tag_name("button").click()
        
        header = driver.find_element_by_tag_name("h5")
        self.assertIn("Announcements", header.text);

        button = driver.find_element_by_id("logoutButton").click()
        header = driver.find_element_by_tag_name("h1")
        self.assertIn("Login to Se7enScheduler", header.text)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()