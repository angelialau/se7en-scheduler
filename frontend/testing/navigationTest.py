from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time

class FormsTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)
        #login
        self.driver.get("http://localhost:4200/login")
    
        email = self.driver.find_element_by_id("email")
        email.send_keys("email@email.com")

        password = self.driver.find_element_by_id("password")
        password.send_keys("password")

        button = self.driver.find_element_by_tag_name("button").click()

    def test_direct_to_login(self):
        driver = self.driver
        driver.get("http://localhost:4200/login")
        header = driver.find_element_by_tag_name("h1")
        self.assertIn("Login to Se7enScheduler", header.text)

    def test_login(self):
        driver = self.driver
        driver.get("http://localhost:4200/login")
        
        email = driver.find_element_by_id("email")
        email.send_keys("email@email.com")

        password = driver.find_element_by_id("password")
        password.send_keys("password")

        button = driver.find_element_by_tag_name("button").click()

        header = driver.find_element_by_tag_name("h5")
        self.assertIn("Announcements", header.text);

    def test_direct_to_home(self):
        driver = self.driver
        driver.get("http://localhost:4200/home")
        self.assertIn("Notifications", driver.page_source)
        # logoutButton

    def test_direct_to_add_user(self):
        driver = self.driver
        driver.get("http://localhost:4200/user")
        self.assertEqual("Create a new Administrator/Instructor", driver.find_element_by_id("createUserFormTitle").text)

    def test_direct_to_add_schedule(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules")
        self.assertIn("Schedules", driver.page_source)

    def test_direct_to_add_course(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/4")
        self.assertEqual("Courses under this Schedule", driver.find_element_by_id("pageTitle").text)

    def test_logout(self):
        driver = self.driver
        driver.get("http://localhost:4200/home")
        
        logoutbutton = driver.find_element_by_id("logoutButton").click()
        self.assertIn("Login", driver.page_source)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

def login(driver):
    driver.get("http://localhost:4200/login")
    
    email = driver.find_element_by_id("email")
    email.send_keys("email@email.com")

    password = driver.find_element_by_id("password")
    password.send_keys("password")

    button = driver.find_element_by_tag_name("button").click()

if __name__ == "__main__":
    unittest.main()