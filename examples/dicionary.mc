public function testDict() {
  System.println("test");
  System.println({
    :a => 1,
    :b => {
      :c => 2,
    },
    :d => Sensor.getTemperature(),
  });
}
